import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type WalkOrg = { title: string };
type WalkGroup = {
    index: number;
    start: number;
    group: { address: string; organizations: WalkOrg[] };
};
type WalkSheet = {
    index: number;
    orgCount: number;
    mapUrl: string;
    sides: {
        top: WalkGroup[];
        left: WalkGroup[];
        right: WalkGroup[];
        bottom: WalkGroup[];
    };
};
export type WalkView = {
    district: { title: string };
    count: number;
    sheets: WalkSheet[];
};

export default function WalkSheets({
    view,
    page,
    onPage,
}: {
    view: WalkView;
    page: number;
    onPage: (page: number) => void;
}) {
    const sheet = view.sheets[page];
    if (!sheet) return null;
    const groups = [
        ...sheet.sides.top,
        ...sheet.sides.left,
        ...sheet.sides.right,
        ...sheet.sides.bottom,
    ].sort((a, b) => a.index - b.index || a.start - b.start);

    return (
        <Stack spacing={2}>
            <Box
                component="img"
                src={sheet.mapUrl}
                alt="кроп района"
                sx={{
                    width: "100%",
                    borderRadius: 2,
                    aspectRatio: mapAspect(sheet.mapUrl),
                    objectFit: "contain",
                    bgcolor: "#dfe7d6",
                }}
            />
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 700 }}>
                    {view.district.title}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                    лист {sheet.index}/{view.sheets.length} · {sheet.orgCount}{" "}
                    орг. · всего {view.count}
                </Typography>
            </Stack>
            {groups.map((item) => (
                <Card key={`${item.index}-${item.start}`} variant="outlined">
                    <CardContent>
                        <Typography sx={{ fontWeight: 700 }}>
                            <Box component="span" sx={{ color: "error.main", mr: 1 }}>
                                {item.index}
                            </Box>
                            {item.group.address}
                        </Typography>
                        {item.group.organizations.map((org, j) => (
                            <Typography key={org.title + j} variant="body2">
                                {item.start + j}. {org.title}
                            </Typography>
                        ))}
                    </CardContent>
                </Card>
            ))}
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    position: "sticky",
                    bottom: 12,
                    p: 1,
                    bgcolor: "background.paper",
                    borderRadius: 8,
                    boxShadow: 3,
                }}
            >
                <Button disabled={page === 0} onClick={() => onPage(page - 1)}>
                    Назад
                </Button>
                <Typography sx={{ flex: 1, textAlign: "center", py: 1 }}>
                    {sheet.index} / {view.sheets.length}
                </Typography>
                <Button
                    disabled={page >= view.sheets.length - 1}
                    onClick={() => onPage(page + 1)}
                >
                    Вперёд
                </Button>
            </Stack>
        </Stack>
    );
}

function mapAspect(mapUrl: string): string {
    try {
        const size = new URL(mapUrl).searchParams.get("size") ?? "650,450";
        const [width, height] = size.split(",").map(Number);
        if (width > 0 && height > 0) return `${width} / ${height}`;
    } catch {
        /* keep default */
    }
    return "650 / 450";
}
