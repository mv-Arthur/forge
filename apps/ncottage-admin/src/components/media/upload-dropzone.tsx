"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import type { Media } from "@forge/shared";
import { uploadMediaAction } from "@/app/media/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UploadDropzone({
    folder,
    onUploaded,
    accept = "image/*,application/pdf",
    className,
}: {
    folder?: string;
    onUploaded: (media: Media) => void;
    accept?: string;
    className?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [drag, setDrag] = useState(false);

    async function handleFiles(files: FileList | File[]) {
        setBusy(true);
        for (const file of Array.from(files)) {
            const fd = new FormData();
            if (folder) fd.append("folder", folder);
            fd.append("file", file);
            const res = await uploadMediaAction(fd);
            if (res.error) {
                toast.error(`${file.name}: ${res.error}`);
            } else if (res.media) {
                onUploaded(res.media);
                toast.success(`Загружено: ${file.name}`);
            }
        }
        setBusy(false);
    }

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                if (e.dataTransfer.files.length) {
                    void handleFiles(e.dataTransfer.files);
                }
            }}
            className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors",
                drag && "border-primary bg-accent",
                busy && "pointer-events-none opacity-60",
                className
            )}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple
                hidden
                onChange={(e) => {
                    if (e.target.files?.length) {
                        void handleFiles(e.target.files);
                    }
                    e.target.value = "";
                }}
            />
            <UploadCloud className="size-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
                Перетащите файлы сюда или
            </p>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
            >
                {busy ? "Загрузка…" : "Выбрать файлы"}
            </Button>
        </div>
    );
}
