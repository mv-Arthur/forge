import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { JobSummary } from "../../src/job-summary.ts";

export default function JobHistory({
    rows,
    onOpen,
}: {
    rows: JobSummary[];
    onOpen: (id: string) => void;
}) {
    if (rows.length === 0) {
        return (
            <Typography color="text.secondary">
                Пока нет сохранённых сборок.
            </Typography>
        );
    }
    return (
        <Stack spacing={1}>
            {rows.map((row) => (
                <Card key={row.id} variant="outlined">
                    <CardActionArea onClick={() => onOpen(row.id)}>
                        <CardContent sx={{ py: 1.25, "&:last-child": { pb: 1.25 } }}>
                            <Typography sx={{ fontWeight: 700 }} noWrap>
                                {row.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatWhen(row.finishedAt)} · {row.count} орг. ·{" "}
                                {row.sheets} л.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </Stack>
    );
}

function formatWhen(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}
