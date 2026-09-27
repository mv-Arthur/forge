import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { MediaItem } from "../lib/api";
import { MediaThumb } from "./MediaThumb";

export function MediaGrid({
    items,
    selectedId,
    onSelect,
}: {
    items: MediaItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}) {
    if (items.length === 0) {
        return (
            <Typography
                color="text.secondary"
                sx={{ p: 6, textAlign: "center" }}
            >
                Пусто. Перетащи файлы сюда или нажми «Загрузить».
            </Typography>
        );
    }
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 2,
            }}
        >
            {items.map((item) => (
                <Card
                    key={item.id}
                    variant="outlined"
                    sx={{
                        outline:
                            item.id === selectedId
                                ? "2px solid"
                                : "1px solid transparent",
                        outlineColor:
                            item.id === selectedId
                                ? "primary.main"
                                : "transparent",
                    }}
                >
                    <CardActionArea onClick={() => onSelect(item.id)}>
                        <MediaThumb
                            fileKey={item.key}
                            mime={item.mime}
                            alt={item.alt ?? item.filename}
                        />
                        <CardContent sx={{ py: 1.2, px: 1.5 }}>
                            <Typography noWrap variant="body2">
                                {item.filename}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    );
}
