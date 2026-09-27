import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdminHeader, type AdminView } from "./AdminHeader";
import {
    assignHomeSlot,
    clearHomeSlot,
    fetchHomePage,
    type HomeGroup,
    type HomeSlotRow,
    type MediaItem,
} from "../lib/api";
import { MediaPicker } from "./MediaPicker";
import { MediaThumb } from "./MediaThumb";

function clusterRows(
    slots: HomeSlotRow[]
): { name: string; slots: HomeSlotRow[] }[] {
    const out: { name: string; slots: HomeSlotRow[] }[] = [];
    for (const row of slots) {
        const name = row.cluster ?? "";
        const last = out[out.length - 1];
        if (!last || last.name !== name) out.push({ name, slots: [] });
        out[out.length - 1].slots.push(row);
    }
    return out;
}

function SlotMedia({
    row,
    featured,
}: {
    row: HomeSlotRow;
    featured?: boolean;
}) {
    const ratio = featured ? "16 / 7" : "4 / 3";
    if (!row.media) {
        return <Box sx={{ aspectRatio: ratio, bgcolor: "action.hover" }} />;
    }
    return (
        <MediaThumb
            fileKey={row.media.key}
            mime={row.media.mime}
            alt={row.label}
            aspectRatio={ratio}
        />
    );
}

export function HomeSlots({
    view,
    onView,
}: {
    view: AdminView;
    onView: (view: AdminView) => void;
}) {
    const [groups, setGroups] = useState<HomeGroup[]>([]);
    const [section, setSection] = useState<string | null>(null);
    const [cluster, setCluster] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pickerSlot, setPickerSlot] = useState<string | null>(null);

    async function reload() {
        setError(null);
        try {
            const data = await fetchHomePage();
            setGroups(data.groups);
            setSection((current) => current ?? data.groups[0]?.group ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }

    useEffect(() => {
        void reload();
    }, []);

    const current =
        groups.find((group) => group.group === section) ?? groups[0];
    const clusters = current ? clusterRows(current.slots) : [];
    const visible = cluster
        ? clusters.filter((row) => row.name === cluster)
        : clusters;

    async function pick(item: MediaItem) {
        if (!pickerSlot) return;
        try {
            const data = await assignHomeSlot(pickerSlot, item.id);
            setGroups(data.groups);
            setPickerSlot(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }

    async function clear(slot: string) {
        try {
            const data = await clearHomeSlot(slot);
            setGroups(data.groups);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }

    function openSection(name: string) {
        setSection(name);
        setCluster(null);
    }

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <AdminHeader view={view} onView={onView} />
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Stack direction="row" sx={{ flex: 1, minHeight: 0 }}>
                <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
                    {current ? (
                        <>
                            <Breadcrumbs sx={{ mb: 2 }}>
                                <Link
                                    component="button"
                                    underline="hover"
                                    color="inherit"
                                    onClick={() => openSection(current.group)}
                                >
                                    {current.group}
                                </Link>
                                {cluster ? (
                                    <Typography color="text.primary">
                                        {cluster}
                                    </Typography>
                                ) : null}
                            </Breadcrumbs>
                            <Stack spacing={3}>
                                {visible.map((block) => {
                                    const featured = block.name === "Фон";
                                    const title = block.name || current.group;
                                    return (
                                        <Card
                                            key={title}
                                            elevation={featured ? 0 : 1}
                                            variant={
                                                featured
                                                    ? undefined
                                                    : "outlined"
                                            }
                                            sx={
                                                featured
                                                    ? {
                                                          bgcolor: "grey.100",
                                                      }
                                                    : undefined
                                            }
                                        >
                                            {block.name ? (
                                                <CardHeader
                                                    title={block.name}
                                                    slotProps={{
                                                        title: {
                                                            variant: "h6",
                                                        },
                                                    }}
                                                />
                                            ) : null}
                                            <CardContent
                                                sx={{
                                                    pt: block.name ? 0 : 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "grid",
                                                        gridTemplateColumns:
                                                            featured
                                                                ? "1fr"
                                                                : "repeat(auto-fill, minmax(200px, 1fr))",
                                                        gap: 2,
                                                    }}
                                                >
                                                    {block.slots.map((row) => (
                                                        <Box
                                                            key={row.slot}
                                                            sx={{
                                                                border: featured
                                                                    ? 0
                                                                    : "1px solid",
                                                                borderColor:
                                                                    "divider",
                                                                borderRadius: 1,
                                                                overflow:
                                                                    "hidden",
                                                            }}
                                                        >
                                                            <SlotMedia
                                                                row={row}
                                                                featured={
                                                                    featured
                                                                }
                                                            />
                                                            {featured ? null : (
                                                                <Stack
                                                                    sx={{
                                                                        p: 1.5,
                                                                    }}
                                                                    spacing={1}
                                                                >
                                                                    <Typography variant="body2">
                                                                        {
                                                                            row.label
                                                                        }
                                                                    </Typography>
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={
                                                                            1
                                                                        }
                                                                    >
                                                                        <Button
                                                                            size="small"
                                                                            onClick={() =>
                                                                                setPickerSlot(
                                                                                    row.slot
                                                                                )
                                                                            }
                                                                        >
                                                                            Выбрать
                                                                        </Button>
                                                                        {row.media ? (
                                                                            <Button
                                                                                size="small"
                                                                                color="error"
                                                                                onClick={() =>
                                                                                    void clear(
                                                                                        row.slot
                                                                                    )
                                                                                }
                                                                            >
                                                                                Снять
                                                                            </Button>
                                                                        ) : null}
                                                                    </Stack>
                                                                </Stack>
                                                            )}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </CardContent>
                                            {featured && block.slots[0] ? (
                                                <CardActions>
                                                    <Button
                                                        onClick={() =>
                                                            setPickerSlot(
                                                                block.slots[0]
                                                                    .slot
                                                            )
                                                        }
                                                    >
                                                        Выбрать
                                                    </Button>
                                                    {block.slots[0].media ? (
                                                        <Button
                                                            color="error"
                                                            onClick={() =>
                                                                void clear(
                                                                    block
                                                                        .slots[0]
                                                                        .slot
                                                                )
                                                            }
                                                        >
                                                            Снять
                                                        </Button>
                                                    ) : null}
                                                </CardActions>
                                            ) : null}
                                        </Card>
                                    );
                                })}
                            </Stack>
                        </>
                    ) : null}
                </Box>
                <List
                    dense
                    subheader={
                        <ListSubheader component="div">Секции</ListSubheader>
                    }
                    sx={{
                        width: 280,
                        flexShrink: 0,
                        overflow: "auto",
                        borderLeft: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {groups.map((group) => {
                        const nested = clusterRows(group.slots).filter(
                            (row) => row.name
                        );
                        const selectedParent =
                            group.group === current?.group && !cluster;
                        return (
                            <Box key={group.group}>
                                <ListItemButton
                                    selected={selectedParent}
                                    onClick={() => openSection(group.group)}
                                >
                                    <ListItemText primary={group.group} />
                                </ListItemButton>
                                {nested.length > 1
                                    ? nested.map((row) => (
                                          <ListItemButton
                                              key={row.name}
                                              selected={
                                                  group.group ===
                                                      current?.group &&
                                                  cluster === row.name
                                              }
                                              sx={{ pl: 4 }}
                                              onClick={() => {
                                                  setSection(group.group);
                                                  setCluster(row.name);
                                              }}
                                          >
                                              <ListItemText
                                                  primary={row.name}
                                                  slotProps={{
                                                      primary: {
                                                          variant: "body2",
                                                      },
                                                  }}
                                              />
                                          </ListItemButton>
                                      ))
                                    : null}
                            </Box>
                        );
                    })}
                </List>
            </Stack>
            <MediaPicker
                open={Boolean(pickerSlot)}
                onClose={() => setPickerSlot(null)}
                onPick={(item) => void pick(item)}
            />
        </Box>
    );
}
