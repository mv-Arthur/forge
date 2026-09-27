import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { listMedia, type MediaItem } from "../lib/api";
import { MediaGrid } from "./MediaGrid";

export function MediaPicker({
    open,
    onClose,
    onPick,
}: {
    open: boolean;
    onClose: () => void;
    onPick: (item: MediaItem) => void;
}) {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<MediaItem[]>([]);

    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => {
            void listMedia({ q: query, take: 200 }).then((res) =>
                setItems(res.items)
            );
        }, 200);
        return () => clearTimeout(timer);
    }, [open, query]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Выбрать кадр</DialogTitle>
            <DialogContent>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="имя, путь, alt"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{ my: 1 }}
                />
                <MediaGrid
                    items={items}
                    selectedId={null}
                    onSelect={(id) => {
                        const item = items.find((row) => row.id === id);
                        if (item) onPick(item);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
}
