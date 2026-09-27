import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { MediaItem } from "../lib/api";
import { formatSize, previewPath } from "../lib/format";
import { MediaThumb } from "./MediaThumb";

export function Inspector({
    item,
    busy,
    onSave,
    onDelete,
}: {
    item: MediaItem | null;
    busy: boolean;
    onSave: (patch: {
        alt?: string;
        folder?: string;
        filename?: string;
    }) => Promise<void>;
    onDelete: () => Promise<void>;
}) {
    const [alt, setAlt] = useState("");
    const [folder, setFolder] = useState("");
    const [filename, setFilename] = useState("");
    const [copied, setCopied] = useState(false);
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        if (!item) return;
        setAlt(item.alt ?? "");
        setFolder(item.folder ?? "");
        setFilename(item.filename);
        setCopied(false);
        setConfirm(false);
    }, [item]);

    if (!item) {
        return (
            <Stack sx={{ width: 320, p: 2, flexShrink: 0 }}>
                <Typography color="text.secondary">
                    Выбери кадр на листе
                </Typography>
            </Stack>
        );
    }

    const path = previewPath(item.key);

    async function copyPath() {
        await navigator.clipboard.writeText(path);
        setCopied(true);
    }

    return (
        <Stack
            sx={{ width: 320, p: 2, flexShrink: 0, gap: 1.5, overflow: "auto" }}
        >
            <MediaThumb
                fileKey={item.key}
                mime={item.mime}
                alt={item.alt ?? item.filename}
                controls
            />
            <Typography variant="caption" color="text.secondary">
                {item.width && item.height
                    ? `${item.width}×${item.height}`
                    : item.mime}
                {" · "}
                {formatSize(item.size)}
            </Typography>
            <Button size="small" onClick={() => void copyPath()}>
                {copied ? "Скопировано" : path}
            </Button>
            <TextField
                label="Имя файла"
                size="small"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
            />
            <TextField
                label="Папка"
                size="small"
                value={folder}
                placeholder="detail/favor"
                onChange={(e) => setFolder(e.target.value)}
            />
            <TextField
                label="Alt"
                size="small"
                multiline
                minRows={3}
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
                <Button
                    variant="contained"
                    disabled={busy}
                    onClick={() => void onSave({ alt, folder, filename })}
                >
                    Сохранить
                </Button>
                <Button
                    color="error"
                    disabled={busy}
                    onClick={() => setConfirm(true)}
                >
                    Удалить
                </Button>
            </Stack>
            <Dialog open={confirm} onClose={() => setConfirm(false)}>
                <DialogTitle>Удалить файл?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {item.filename} будет удалён с диска.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm(false)}>Отмена</Button>
                    <Button
                        color="error"
                        onClick={() => {
                            setConfirm(false);
                            void onDelete();
                        }}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
