import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { folderLabel } from "../lib/format";
import type { FolderRow } from "../lib/api";

export function FolderRail({
    folders,
    current,
    onSelect,
}: {
    folders: FolderRow[];
    current: string | undefined;
    onSelect: (folder: string | undefined) => void;
}) {
    return (
        <List
            dense
            subheader={<ListSubheader component="div">Папки</ListSubheader>}
            sx={{ width: 260, flexShrink: 0, overflow: "auto" }}
        >
            <ListItemButton
                selected={current === undefined}
                onClick={() => onSelect(undefined)}
            >
                <ListItemText primary="Все кадры" />
            </ListItemButton>
            {folders.map((row) => (
                <ListItemButton
                    key={row.path || "root"}
                    selected={current === row.path}
                    onClick={() => onSelect(row.path)}
                    sx={{
                        pl:
                            2 +
                            row.path.split("/").filter(Boolean).length * 1.5,
                    }}
                >
                    <ListItemText
                        primary={folderLabel(row.path)}
                        secondary={`${row.count}`}
                    />
                </ListItemButton>
            ))}
        </List>
    );
}
