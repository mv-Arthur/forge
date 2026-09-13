import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { JOB_STAGES, parseJobProgress } from "../../src/job-progress.ts";

export default function JobProgress({
    message,
    percent,
    paused,
}: {
    message: string;
    percent?: number | null;
    paused?: boolean;
}) {
    const view = parseJobProgress(message);
    const shown = Math.round(
        percent == null ? view.ratio * 100 : percent
    );

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            <Stack spacing={2}>
                <Box>
                    <Typography sx={{ fontWeight: 800 }}>
                        {paused ? "На паузе" : view.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        aria-live="polite"
                    >
                        {view.detail}
                    </Typography>
                </Box>
                <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center" }}
                >
                    <LinearProgress
                        variant="determinate"
                        value={shown}
                        sx={{ flex: 1, height: 8, borderRadius: 99 }}
                    />
                    <Typography
                        sx={{
                            fontWeight: 800,
                            minWidth: "4ch",
                            textAlign: "right",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {shown}%
                    </Typography>
                </Stack>
                <Box sx={{ position: "relative", pl: 0.25 }}>
                    <Box
                        sx={{
                            position: "absolute",
                            left: 10,
                            top: 12,
                            bottom: 12,
                            width: 2,
                            bgcolor: "divider",
                        }}
                    />
                    <Stack spacing={1.5}>
                        {JOB_STAGES.map((stage) => {
                            const done = view.completed.includes(stage.id);
                            const active = view.active === stage.id && !done;
                            return (
                                <Stack
                                    key={stage.id}
                                    direction="row"
                                    spacing={1.5}
                                    sx={{ alignItems: "center", position: "relative" }}
                                >
                                    <StageDot
                                        state={
                                            done ? "done" : active ? "active" : "wait"
                                        }
                                        paused={Boolean(paused && active)}
                                    />
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: active ? 700 : 600,
                                                color: active
                                                    ? "primary.main"
                                                    : done
                                                      ? "text.primary"
                                                      : "text.secondary",
                                            }}
                                        >
                                            {stage.title}
                                        </Typography>
                                    </Box>
                                </Stack>
                            );
                        })}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}

function StageDot({
    state,
    paused,
}: {
    state: "done" | "active" | "wait";
    paused?: boolean;
}) {
    return (
        <Box
            sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                zIndex: 1,
                bgcolor: state === "wait" ? "background.paper" : "primary.main",
                color: "#fff",
                border: "2px solid",
                borderColor: state === "wait" ? "divider" : "primary.main",
                fontSize: 12,
                fontWeight: 800,
                animation:
                    state === "active" && !paused
                        ? "jobPulse 1.4s ease-out infinite"
                        : "none",
                "@keyframes jobPulse": {
                    "0%": { boxShadow: "0 0 0 0 rgba(26, 35, 126, 0.45)" },
                    "100%": { boxShadow: "0 0 0 8px rgba(26, 35, 126, 0)" },
                },
            }}
            aria-hidden
        >
            {state === "done" ? "✓" : state === "active" ? "•" : ""}
        </Box>
    );
}
