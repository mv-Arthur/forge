"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { Media } from "@forge/shared";
import { listMediaAction } from "@/app/media/actions";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MediaThumb } from "./media-thumb";
import { UploadDropzone } from "./upload-dropzone";

export function MediaPicker({
    trigger,
    multiple = false,
    folder,
    onSelect,
}: {
    trigger: React.ReactNode;
    multiple?: boolean;
    folder?: string;
    onSelect: (media: Media[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        listMediaAction({ folder })
            .then((r) => setItems(r.items))
            .finally(() => setLoading(false));
    }, [open, folder]);

    function toggle(media: Media) {
        if (!multiple) {
            onSelect([media]);
            setOpen(false);
            return;
        }
        setSelected((cur) =>
            cur.includes(media.id)
                ? cur.filter((x) => x !== media.id)
                : [...cur, media.id]
        );
    }

    function confirmMulti() {
        const chosen = selected
            .map((id) => items.find((m) => m.id === id))
            .filter((m): m is Media => Boolean(m));
        onSelect(chosen);
        setSelected([]);
        setOpen(false);
    }

    function onUploaded(media: Media) {
        setItems((cur) => [media, ...cur]);
        if (!multiple) {
            onSelect([media]);
            setOpen(false);
        } else {
            setSelected((cur) => [...cur, media.id]);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Медиатека</DialogTitle>
                    <DialogDescription>
                        Выберите файл из библиотеки или загрузите новый.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="library">
                    <TabsList>
                        <TabsTrigger value="library">Библиотека</TabsTrigger>
                        <TabsTrigger value="upload">Загрузить</TabsTrigger>
                    </TabsList>
                    <TabsContent value="library">
                        {loading ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">
                                Загрузка…
                            </p>
                        ) : items.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">
                                Файлов пока нет — загрузите на соседней вкладке.
                            </p>
                        ) : (
                            <div className="grid max-h-[50vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
                                {items.map((media) => {
                                    const sel = selected.includes(media.id);
                                    return (
                                        <button
                                            key={media.id}
                                            type="button"
                                            onClick={() => toggle(media)}
                                            title={media.filename}
                                            className={cn(
                                                "relative aspect-square overflow-hidden rounded-lg border transition-all hover:ring-2 hover:ring-ring",
                                                sel &&
                                                    "ring-2 ring-primary ring-offset-2"
                                            )}
                                        >
                                            <MediaThumb media={media} />
                                            {multiple && sel && (
                                                <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                    <Check className="size-3" />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="upload">
                        <UploadDropzone
                            folder={folder}
                            onUploaded={onUploaded}
                            className="py-10"
                        />
                    </TabsContent>
                </Tabs>
                {multiple && (
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={confirmMulti}
                            disabled={selected.length === 0}
                        >
                            Добавить ({selected.length})
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
