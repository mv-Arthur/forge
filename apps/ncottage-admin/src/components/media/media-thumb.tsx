import { FileText } from "lucide-react";
import type { Media } from "@forge/shared";
import { cn } from "@/lib/utils";

export function MediaThumb({
    media,
    className,
}: {
    media: Media;
    className?: string;
}) {
    if (media.mime.startsWith("image/")) {
        return (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary S3 hosts, admin-internal
            <img
                src={media.url}
                alt={media.alt ?? media.filename}
                loading="lazy"
                className={cn("h-full w-full object-cover", className)}
            />
        );
    }
    return (
        <div
            className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-1 bg-muted text-muted-foreground",
                className
            )}
        >
            <FileText className="size-8" />
            <span className="px-2 text-center text-[10px] break-all">
                {media.filename}
            </span>
        </div>
    );
}
