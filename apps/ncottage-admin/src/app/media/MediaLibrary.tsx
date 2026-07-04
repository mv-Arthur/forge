"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Media } from "@forge/shared";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsAdmin } from "@/components/admin-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaThumb } from "@/components/media/media-thumb";
import { UploadDropzone } from "@/components/media/upload-dropzone";
import { deleteMediaAction, updateMediaAction } from "./actions";

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function DeleteMediaButton({ onConfirm }: { onConfirm: () => Promise<void> }) {
    const isAdmin = useIsAdmin();
    const [pending, setPending] = useState(false);
    if (!isAdmin) return null;
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label="Удалить"
                >
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить файл?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Файл будет удалён из хранилища. Ссылки на него в
                        контенте перестанут работать.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>
                        Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            setPending(true);
                            void onConfirm().finally(() => setPending(false));
                        }}
                        disabled={pending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        Удалить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function EditAltDialog({
    media,
    onSave,
}: {
    media: Media;
    onSave: (alt: string) => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [alt, setAlt] = useState(media.alt ?? "");
    const [pending, setPending] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label="Изменить alt-текст"
                >
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alt-текст</DialogTitle>
                    <DialogDescription>
                        Описание для скринридеров и SEO: «{media.filename}».
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="media-alt">Alt-текст</Label>
                    <Input
                        id="media-alt"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        placeholder="Например: фасад каркасного дома"
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                            setPending(true);
                            void onSave(alt)
                                .then(() => setOpen(false))
                                .finally(() => setPending(false));
                        }}
                    >
                        {pending ? "Сохранение…" : "Сохранить"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function MediaLibrary({ initial }: { initial: Media[] }) {
    const [items, setItems] = useState(initial);

    async function onDelete(media: Media) {
        const result = await deleteMediaAction(media.id);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        setItems((cur) => cur.filter((m) => m.id !== media.id));
        toast.success("Файл удалён");
    }

    async function onSaveAlt(media: Media, alt: string) {
        const result = await updateMediaAction(media.id, alt);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        setItems((cur) =>
            cur.map((m) =>
                m.id === media.id ? { ...m, alt: alt.trim() || undefined } : m
            )
        );
        toast.success("Alt-текст сохранён");
    }

    return (
        <div className="space-y-6">
            <UploadDropzone
                onUploaded={(media) => setItems((cur) => [media, ...cur])}
            />

            {items.length === 0 ? (
                <p className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
                    Файлов пока нет — загрузите первый.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {items.map((media) => (
                        <div
                            key={media.id}
                            className="overflow-hidden rounded-lg border"
                        >
                            <a
                                href={media.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block aspect-square bg-muted"
                            >
                                <MediaThumb media={media} />
                            </a>
                            <div className="flex items-center justify-between gap-1 p-2">
                                <div className="min-w-0">
                                    <p
                                        className="truncate text-xs font-medium"
                                        title={media.filename}
                                    >
                                        {media.filename}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {media.width && media.height
                                            ? `${media.width}×${media.height} · `
                                            : ""}
                                        {formatSize(media.size)}
                                    </p>
                                    <p
                                        className="truncate text-[11px] text-muted-foreground italic"
                                        title={media.alt}
                                    >
                                        {media.alt
                                            ? `alt: ${media.alt}`
                                            : "alt не задан"}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center">
                                    <EditAltDialog
                                        media={media}
                                        onSave={(alt) => onSaveAlt(media, alt)}
                                    />
                                    <DeleteMediaButton
                                        onConfirm={() => onDelete(media)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
