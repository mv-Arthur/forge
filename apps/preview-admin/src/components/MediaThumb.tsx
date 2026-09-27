import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { fetchFileObjectUrl } from "../lib/api";
import { isVideo } from "../lib/format";

export function MediaThumb({
    fileKey,
    mime,
    alt,
    controls = false,
    aspectRatio = "4 / 3",
}: {
    fileKey: string;
    mime: string;
    alt: string;
    controls?: boolean;
    aspectRatio?: string;
}) {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | null = null;
        let cancelled = false;
        void fetchFileObjectUrl(fileKey)
            .then((url) => {
                objectUrl = url;
                if (!cancelled) setSrc(url);
                else URL.revokeObjectURL(url);
            })
            .catch(() => {
                if (!cancelled) setSrc(null);
            });
        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [fileKey]);

    if (!src) {
        return (
            <Box
                sx={{
                    width: "100%",
                    aspectRatio,
                    bgcolor: "action.hover",
                }}
            />
        );
    }

    if (isVideo(mime)) {
        return (
            <Box
                component="video"
                src={src}
                muted={!controls}
                playsInline
                controls={controls}
                sx={{
                    width: "100%",
                    aspectRatio,
                    objectFit: controls ? "contain" : "cover",
                    display: "block",
                    bgcolor: "common.black",
                }}
            />
        );
    }

    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            sx={{
                width: "100%",
                aspectRatio,
                objectFit: controls ? "contain" : "cover",
                display: "block",
            }}
        />
    );
}
