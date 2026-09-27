import { useRef, useState, type DragEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMediaLibrary } from "../hooks/useMediaLibrary";
import { AdminHeader, type AdminView } from "./AdminHeader";
import { FolderRail } from "./FolderRail";
import { Inspector } from "./Inspector";
import { MediaGrid } from "./MediaGrid";

export function Library({
    view,
    onView,
}: {
    view: AdminView;
    onView: (view: AdminView) => void;
}) {
    const lib = useMediaLibrary();
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    function onDrop(e: DragEvent) {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) {
            void lib.upload(e.dataTransfer.files);
        }
    }

    return (
        <Box
            sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
            onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
        >
            <AdminHeader
                view={view}
                onView={onView}
                actions={
                    <>
                        <TextField
                            size="small"
                            placeholder="имя, путь, alt"
                            value={lib.query}
                            onChange={(e) => lib.setQuery(e.target.value)}
                            sx={{
                                minWidth: 220,
                                bgcolor: "common.white",
                                borderRadius: 1,
                            }}
                        />
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={() => inputRef.current?.click()}
                        >
                            Загрузить
                        </Button>
                        <input
                            ref={inputRef}
                            type="file"
                            hidden
                            multiple
                            accept="image/*,video/mp4,video/webm,.svg"
                            onChange={(e) => {
                                if (e.target.files?.length) {
                                    void lib.upload(e.target.files);
                                }
                                e.target.value = "";
                            }}
                        />
                    </>
                }
            />
            {lib.error ? <Alert severity="error">{lib.error}</Alert> : null}
            <Stack
                direction="row"
                sx={{ flex: 1, minHeight: 0, position: "relative" }}
            >
                <FolderRail
                    folders={lib.folders}
                    current={lib.folder}
                    onSelect={lib.setFolder}
                />
                <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        {lib.total} {lib.busy ? "· пишем…" : "кадров"}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <MediaGrid
                            items={lib.items}
                            selectedId={lib.selected?.id ?? null}
                            onSelect={lib.setSelectedId}
                        />
                    </Box>
                </Box>
                <Inspector
                    item={lib.selected}
                    busy={lib.busy}
                    onSave={lib.save}
                    onDelete={lib.remove}
                />
                {dragOver ? (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 12,
                            display: "grid",
                            placeItems: "center",
                            border: "2px dashed",
                            borderColor: "primary.main",
                            bgcolor: "background.paper",
                            pointerEvents: "none",
                            zIndex: 2,
                        }}
                    >
                        <Typography variant="h5">Брось кадры сюда</Typography>
                    </Box>
                ) : null}
            </Stack>
        </Box>
    );
}
