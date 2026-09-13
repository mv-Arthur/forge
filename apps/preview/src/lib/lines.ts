import { LINE_TITLE } from "./copy";

export type LineId = keyof typeof LINE_TITLE;

export const LINE_ORDER: LineId[] = [
    "scandi",
    "barn",
    "modern",
    "estate",
    "compact",
    "second_light",
    "classic",
];

const LINE_BY_SLUG: Record<string, LineId> = {
    anamur: "compact",
    asten: "compact",
    "bergen-mini": "compact",
    forest: "compact",
    lids: "compact",
    littl: "compact",
    mersin: "compact",
    villadzh: "compact",
    esteyt: "modern",
    favor: "modern",
    glazgo: "modern",
    greys: "modern",
    lester: "modern",
    optima: "modern",
    orta: "modern",
    smart: "modern",
    alaster: "estate",
    bavariya: "estate",
    bazel: "estate",
    berlin: "estate",
    fargo: "estate",
    "gostinica-3": "estate",
    "gostinica-12": "estate",
    grand: "estate",
    kasl: "estate",
    meliton: "estate",
    nottingem: "estate",
    venec: "estate",
    "a-dom": "second_light",
    atrium: "second_light",
    born: "second_light",
    chester: "second_light",
    erika: "second_light",
    vikont: "second_light",
    vitrazh: "second_light",
    arkada: "barn",
    daysen: "scandi",
    don: "scandi",
    "don-gas_concrete-12652": "scandi",
    dorn: "scandi",
    dover: "scandi",
    faron: "scandi",
    fest: "scandi",
    hart: "scandi",
    marokko: "scandi",
    otto: "scandi",
    shtern: "scandi",
    skandik: "scandi",
    turku: "scandi",
    uayt: "scandi",
    viladzh: "scandi",
    arbeyt: "classic",
    batik: "classic",
    dortmund: "classic",
    eliot: "classic",
    "eliot-brick-6848": "classic",
    fort: "classic",
    garnet: "classic",
    kanon: "classic",
    liverpul: "classic",
    nord: "classic",
    stoun: "classic",
    terem: "classic",
    vermion: "classic",
    vernisazh: "classic",
    vinkel: "classic",
};

export function isLineId(value: string): value is LineId {
    return (LINE_ORDER as string[]).includes(value);
}

export function parseLineIds(raw: string | null): LineId[] {
    if (!raw) return [];
    const out: LineId[] = [];
    for (const part of raw.split(",")) {
        const value = part.trim();
        if (isLineId(value) && !out.includes(value)) out.push(value);
    }
    return out;
}

export function projectLine(slug: string): LineId {
    return LINE_BY_SLUG[slug] ?? "classic";
}

export function groupByLine<T extends { slug: string }>(
    projects: T[],
): Array<{ id: LineId; projects: T[] }> {
    const buckets = new Map<LineId, T[]>();
    for (const id of LINE_ORDER) buckets.set(id, []);
    for (const project of projects) {
        buckets.get(projectLine(project.slug))?.push(project);
    }
    return LINE_ORDER.flatMap((id) => {
        const list = buckets.get(id);
        return list && list.length > 0 ? [{ id, projects: list }] : [];
    });
}
