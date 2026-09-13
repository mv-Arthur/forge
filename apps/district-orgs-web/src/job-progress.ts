export type JobStageId = "district" | "orgs" | "houses" | "sheets";

export type JobStage = {
    id: JobStageId;
    title: string;
};

export const JOB_STAGES: JobStage[] = [
    { id: "district", title: "Ищем район" },
    { id: "orgs", title: "Собираем организации" },
    { id: "houses", title: "Уточняем адреса" },
    { id: "sheets", title: "Раскладываем листы" },
];

export type JobProgressView = {
    active: JobStageId;
    completed: JobStageId[];
    title: string;
    detail: string;
    ratio: number;
    determinate: boolean;
};

const STAGES: JobStageId[] = ["district", "orgs", "houses", "sheets"];

export function parseJobProgress(message: string): JobProgressView {
    const text = message.trim();
    const lookup = text.match(/^lookup\s+(.+)$/u);
    if (lookup) {
        return view("district", [], lookup[1] ?? "", 0.05, true);
    }
    const search = text.match(/^search\s+(\d+)(?:\/(\d+))?$/u);
    if (search) {
        const count = Number(search[1]);
        const total = search[2] ? Number(search[2]) : null;
        const share =
            total && total > 0 ? clamp(count / total) : clamp(count / 2000);
        return view(
            "orgs",
            ["district"],
            searchDetail(count, total),
            0.08 + 0.37 * share,
            true
        );
    }
    const house = text.match(/^house\s+(\d+)(?:\/(\d+))?$/u);
    if (house) {
        const count = Number(house[1]);
        const total = house[2] ? Number(house[2]) : null;
        const share =
            total && total > 0 ? clamp(count / total) : clamp(count / 800);
        return view(
            "houses",
            ["district", "orgs"],
            houseDetail(count, total),
            0.48 + 0.47 * share,
            true
        );
    }
    if (text === "done") {
        return view(
            "sheets",
            ["district", "orgs", "houses", "sheets"],
            "Готово",
            1,
            true
        );
    }
    return view("district", [], "Открываем Карты", 0.03, true);
}

export function jobPercent(message: string): number {
    return Math.round(parseJobProgress(message).ratio * 100);
}

function view(
    active: JobStageId,
    completed: JobStageId[],
    detail: string,
    ratio: number,
    determinate: boolean
): JobProgressView {
    const title = JOB_STAGES.find((stage) => stage.id === active)?.title ?? "";
    return {
        active,
        completed: STAGES.filter((id) => completed.includes(id)),
        title,
        detail,
        ratio,
        determinate,
    };
}

function searchDetail(count: number, total: number | null): string {
    if (count === 0 && (total == null || total === 0)) {
        return "Ищем точки на карте";
    }
    if (total && total > 0) {
        return `${formatCount(count)} из ${formatCount(total)} организаций`;
    }
    return `${formatCount(count)} организаций`;
}

function houseDetail(count: number, total: number | null): string {
    if (total && total > 0) {
        return `${formatCount(count)} из ${formatCount(total)} домов`;
    }
    return `${formatCount(count)} домов`;
}

function formatCount(value: number): string {
    return value.toLocaleString("ru-RU");
}

function clamp(value: number): number {
    if (!Number.isFinite(value) || value < 0) return 0;
    if (value > 1) return 1;
    return value;
}
