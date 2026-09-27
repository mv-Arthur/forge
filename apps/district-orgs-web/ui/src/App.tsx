import { useEffect, useMemo, useRef, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { MoscowDistrict } from "../../src/moscow-districts.ts";
import type { JobSummary } from "../../src/job-summary.ts";
import { readJobId } from "../../src/job-id.ts";
import { jobPath } from "../../src/route.ts";
import { forgetJob, rememberJob } from "./activeJob";
import JobHistory from "./JobHistory";
import JobProgress from "./JobProgress";
import WalkSheets from "./WalkSheets";
import type { WalkView } from "./WalkSheets";
import { fetchJob, isAbort, watchJob } from "./watchJob";
import type { JobSnapshot } from "./watchJob";
import { useRoute } from "./useRoute";

type TelegramTheme = {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
};

function telegram(): {
    ready?: () => void;
    expand?: () => void;
    themeParams?: TelegramTheme;
} {
    return (
        (window as unknown as { Telegram?: { WebApp?: ReturnType<typeof telegram> } })
            .Telegram?.WebApp ?? {}
    );
}

export default function App() {
    const tg = telegram();
    useEffect(() => {
        tg.ready?.();
        tg.expand?.();
    }, [tg]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: "light",
                    primary: { main: tg.themeParams?.button_color ?? "#1a237e" },
                    background: {
                        default: tg.themeParams?.bg_color ?? "#f4efe6",
                        paper: tg.themeParams?.secondary_bg_color ?? "#fffdf8",
                    },
                    text: {
                        primary: tg.themeParams?.text_color ?? "#1a1814",
                        secondary: tg.themeParams?.hint_color ?? "#6b6458",
                    },
                },
                shape: { borderRadius: 12 },
                typography: {
                    fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", sans-serif',
                },
            }),
        [tg.themeParams]
    );

    const [route, go] = useRoute();
    const [districts, setDistricts] = useState<MoscowDistrict[]>([]);
    const [source, setSource] = useState<"district" | "url">("district");
    const [selected, setSelected] = useState<MoscowDistrict | null>(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState("");
    const [percent, setPercent] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<string | null>(null);
    const [view, setView] = useState<WalkView | null>(null);
    const [history, setHistory] = useState<JobSummary[]>([]);
    const [page, setPage] = useState(0);
    const follow = useRef<AbortController | null>(null);

    useEffect(() => {
        void fetch("/api/districts")
            .then((res) => res.json())
            .then((rows: MoscowDistrict[]) => setDistricts(rows))
            .catch(() => setError("Не удалось загрузить список районов"));
        void loadHistory();
    }, []);

    useEffect(() => {
        const fromQuery = readJobId(location.search);
        if (fromQuery && route.name !== "job") {
            go(jobPath(fromQuery), true);
        }
    }, []);

    useEffect(() => {
        if (route.name !== "job") return;
        const ac = new AbortController();
        follow.current = ac;
        void openJob(route.id, ac.signal);
        return () => ac.abort();
    }, [route.name === "job" ? route.id : ""]);

    function applyJob(job: JobSnapshot) {
        if (job.status) setJobStatus(job.status);
        if (job.progress) setProgress(job.progress);
        if (job.percent != null) setPercent(job.percent);
    }

    async function openJob(id: string, signal: AbortSignal) {
        setJobId(id);
        rememberJob(id);
        setError("");
        setView(null);
        setPage(0);
        setBusy(true);
        try {
            const current = await fetchJob(id);
            if (signal.aborted) return;
            applyJob(current);
            if (current.status === "done" && current.view) {
                show(current.view as WalkView);
                return;
            }
            if (current.status === "cancelled") {
                forgetJob();
                go("/", true);
                return;
            }
            if (current.status === "error") {
                setError(current.error || "Не собралось");
                return;
            }
            const finished = await watchJob(id, applyJob, signal);
            if (signal.aborted) return;
            if (finished.status === "cancelled") {
                forgetJob();
                go("/", true);
                return;
            }
            show(finished.view as WalkView);
        } catch (err) {
            if (isAbort(err) || signal.aborted) return;
            forgetJob();
            const message = err instanceof Error ? err.message : String(err);
            if (message !== "Job not found") setError(message);
        } finally {
            if (!signal.aborted) setBusy(false);
        }
    }

    async function submit() {
        follow.current?.abort();
        setError("");
        setBusy(true);
        setProgress("Готовлю запрос…");
        setPercent(3);
        setView(null);
        try {
            const body =
                source === "url"
                    ? { url: url.trim() }
                    : { districtId: selected?.id };
            const created = await postJson("/api/jobs", body);
            rememberJob(created.id as string);
            setJobId(created.id as string);
            applyJob(created);
            go(jobPath(created.id as string), true);
        } catch (err) {
            setBusy(false);
            setError(err instanceof Error ? err.message : String(err));
        }
    }

    function show(next: WalkView) {
        setView(next);
        setPage(0);
        setProgress("");
        setPercent(null);
        setJobStatus("done");
        setBusy(false);
        void loadHistory();
    }

    async function loadHistory() {
        try {
            const rows = (await fetch("/api/jobs").then((res) =>
                res.json()
            )) as JobSummary[];
            if (Array.isArray(rows)) setHistory(rows);
        } catch {
            /* keep previous list */
        }
    }

    async function sendAction(action: "pause" | "resume" | "cancel") {
        if (!jobId) return;
        try {
            const job = await postJson(
                `/api/jobs/${encodeURIComponent(jobId)}/${action}`,
                {}
            );
            applyJob(job);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }

    const generating = jobStatus === "running" || jobStatus === "paused";
    const nav =
        route.name === "history" || (route.name === "job" && !generating)
            ? "history"
            : "home";
    const title =
        route.name === "history"
            ? "История"
            : route.name === "job"
              ? view?.district.title ?? "Сборка"
              : "Листы обхода";

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm" sx={{ py: 2, pb: 10 }}>
                <Typography variant="overline" color="primary">
                    Яндекс.Карты
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
                    {title}
                </Typography>
                <ToggleButtonGroup
                    exclusive
                    fullWidth
                    value={nav}
                    onChange={(_e, next: "home" | "history" | null) => {
                        if (next === "home") go("/");
                        if (next === "history") go("/history");
                    }}
                    aria-label="Разделы"
                    sx={{
                        mb: 2,
                        bgcolor: "background.paper",
                        "& .MuiToggleButtonGroup-grouped": {
                            textTransform: "none",
                            fontWeight: 700,
                            py: 1.15,
                        },
                        "& .MuiToggleButton-root.Mui-selected": {
                            bgcolor: "primary.main",
                            color: "#fff",
                            "&:hover": { bgcolor: "primary.dark" },
                        },
                    }}
                >
                    <ToggleButton value="home">Сборка</ToggleButton>
                    <ToggleButton value="history">История</ToggleButton>
                </ToggleButtonGroup>
                {route.name === "job" ? (
                    <Button
                        onClick={() => go(generating ? "/" : "/history")}
                        sx={{
                            display: "block",
                            mb: 2,
                            px: 0,
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        {generating ? "← К сборке" : "← К истории"}
                    </Button>
                ) : null}

                {route.name === "home" ? (
                    <HomeForm
                        districts={districts}
                        source={source}
                        selected={selected}
                        url={url}
                        busy={busy}
                        error={error}
                        generating={generating}
                        jobId={jobId}
                        onSource={setSource}
                        onSelected={setSelected}
                        onUrl={setUrl}
                        onSubmit={() => void submit()}
                        onOpenJob={(id) => go(jobPath(id))}
                    />
                ) : null}

                {route.name === "history" ? (
                    <JobHistory
                        rows={history}
                        onOpen={(id) => go(jobPath(id))}
                    />
                ) : null}

                {route.name === "job" ? (
                    <Stack spacing={2}>
                        {error ? (
                            <Typography variant="body2" color="error">
                                {error}
                            </Typography>
                        ) : null}
                        {busy || generating ? (
                            <Stack spacing={1}>
                                <JobProgress
                                    message={progress}
                                    percent={percent}
                                    paused={jobStatus === "paused"}
                                />
                                <Stack direction="row" spacing={1}>
                                    {jobStatus === "paused" ? (
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            onClick={() => void sendAction("resume")}
                                        >
                                            Возобновить
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            onClick={() => void sendAction("pause")}
                                        >
                                            Остановить
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        fullWidth
                                        onClick={() => void sendAction("cancel")}
                                    >
                                        Отменить
                                    </Button>
                                </Stack>
                            </Stack>
                        ) : null}
                        {view ? (
                            <WalkSheets view={view} page={page} onPage={setPage} />
                        ) : null}
                    </Stack>
                ) : null}
            </Container>
        </ThemeProvider>
    );
}

function HomeForm({
    districts,
    source,
    selected,
    url,
    busy,
    error,
    generating,
    jobId,
    onSource,
    onSelected,
    onUrl,
    onSubmit,
    onOpenJob,
}: {
    districts: MoscowDistrict[];
    source: "district" | "url";
    selected: MoscowDistrict | null;
    url: string;
    busy: boolean;
    error: string;
    generating: boolean;
    jobId: string | null;
    onSource: (source: "district" | "url") => void;
    onSelected: (row: MoscowDistrict | null) => void;
    onUrl: (value: string) => void;
    onSubmit: () => void;
    onOpenJob: (id: string) => void;
}) {
    return (
        <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
                Выбери район Москвы или вставь ссылку на район в Картах.
            </Typography>
            <ToggleButtonGroup
                exclusive
                fullWidth
                value={source}
                onChange={(_e, next: "district" | "url" | null) => {
                    if (next) onSource(next);
                }}
                aria-label="Способ выбора района"
                sx={{
                    bgcolor: "background.paper",
                    "& .MuiToggleButtonGroup-grouped": {
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1.15,
                    },
                    "& .MuiToggleButton-root.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "#fff",
                        "&:hover": { bgcolor: "primary.dark" },
                    },
                }}
            >
                <ToggleButton value="district">Район Москвы</ToggleButton>
                <ToggleButton value="url">Ссылка</ToggleButton>
            </ToggleButtonGroup>
            {source === "district" ? (
                <Autocomplete
                    options={districts}
                    groupBy={(row) => row.okrug}
                    getOptionLabel={(row) => row.name}
                    value={selected}
                    onChange={(_e, value) => onSelected(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Район Москвы"
                            placeholder="Начни вводить название"
                        />
                    )}
                />
            ) : (
                <TextField
                    label="Ссылка на район в Картах"
                    placeholder="https://yandex.ru/maps/…/geo/…"
                    value={url}
                    onChange={(event) => onUrl(event.target.value)}
                    fullWidth
                />
            )}
            <Button
                variant="contained"
                size="large"
                disabled={busy || (source === "url" ? !url.trim() : !selected)}
                onClick={onSubmit}
            >
                Собрать листы
            </Button>
            {generating && jobId ? (
                <Button variant="outlined" onClick={() => onOpenJob(jobId)}>
                    Сборка идёт — открыть
                </Button>
            ) : null}
            {error ? (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            ) : null}
        </Stack>
    );
}

async function postJson(path: string, body: unknown) {
    const response = await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || response.statusText);
    return data;
}
