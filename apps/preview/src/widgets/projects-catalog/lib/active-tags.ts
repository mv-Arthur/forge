import type { CatalogFilterState, CatalogKind } from "@/lib/catalogFilter";
import {
    COLLECTION_TITLE,
    LINE_TITLE,
    POPULAR_BATH_TAB,
    POPULAR_INDIVIDUAL_TAB,
    POPULAR_SERIAL_TAB,
} from "@/lib/copy";
import { formatTechnologyBrand } from "@/lib/format";
import type { CollectionId } from "@/lib/collections";
import type { LineId } from "@/lib/lines";

export type ActiveFilterTag = {
    key: string;
    label: string;
};

const FLOOR_LABEL: Record<string, string> = {
    "1": "1 этаж",
    "2": "2 этажа",
    mansard: "С мансардой",
};

function rangeLabel(
    min: number,
    max: number,
    openMin: number,
    openMax: number,
    unit: string,
): string | null {
    const minOn = min !== openMin;
    const maxOn = max !== openMax;
    if (!minOn && !maxOn) return null;
    if (minOn && maxOn) return `${min}-${max} ${unit}`;
    if (minOn) return `от ${min} ${unit}`;
    return `до ${max} ${unit}`;
}

export function listActiveFilterTags(
    state: CatalogFilterState,
    open: CatalogFilterState,
    query: string,
): ActiveFilterTag[] {
    const tags: ActiveFilterTag[] = [];
    const q = query.trim();
    if (q) tags.push({ key: "q", label: q });

    if (state.kind.length === 1) {
        const kind = state.kind[0];
        tags.push({
            key: `kind:${kind}`,
            label:
                kind === "serial"
                    ? POPULAR_SERIAL_TAB
                    : kind === "bath"
                      ? POPULAR_BATH_TAB
                      : POPULAR_INDIVIDUAL_TAB,
        });
    }

    for (const line of state.lines) {
        tags.push({ key: `line:${line}`, label: LINE_TITLE[line] });
    }
    for (const tech of state.tech) {
        tags.push({
            key: `tech:${tech}`,
            label: formatTechnologyBrand(tech),
        });
    }

    const area = rangeLabel(
        state.areaMin,
        state.areaMax,
        open.areaMin,
        open.areaMax,
        "м²",
    );
    if (area) tags.push({ key: "area", label: area });

    const price = rangeLabel(
        state.priceMin,
        state.priceMax,
        open.priceMin,
        open.priceMax,
        "млн",
    );
    if (price) tags.push({ key: "price", label: price });

    for (const floor of state.floors) {
        tags.push({
            key: `floors:${floor}`,
            label: FLOOR_LABEL[floor] ?? floor,
        });
    }
    for (const n of state.rooms) {
        tags.push({
            key: `rooms:${n}`,
            label: n >= 7 ? `${n}+ комн.` : `${n} комн.`,
        });
    }
    for (const n of state.baths) {
        tags.push({
            key: `baths:${n}`,
            label: n >= 6 ? `${n}+ с/у` : `${n} с/у`,
        });
    }
    if (state.collection) {
        tags.push({
            key: "collection",
            label: COLLECTION_TITLE[state.collection as CollectionId],
        });
    }
    return tags;
}

function dropValue<T>(list: T[], value: T): T[] {
    return list.filter((item) => item !== value);
}

export function clearActiveFilterTag(
    state: CatalogFilterState,
    open: CatalogFilterState,
    key: string,
): CatalogFilterState {
    if (key === "area") {
        return { ...state, areaMin: open.areaMin, areaMax: open.areaMax };
    }
    if (key === "price") {
        return { ...state, priceMin: open.priceMin, priceMax: open.priceMax };
    }
    if (key === "collection") {
        return { ...state, collection: "" };
    }
    const split = key.indexOf(":");
    if (split === -1) return state;
    const field = key.slice(0, split);
    const value = key.slice(split + 1);
    if (field === "kind") {
        const kind = dropValue(state.kind, value as CatalogKind);
        const lines = value === "serial" ? [] : state.lines;
        return { ...state, kind, lines };
    }
    if (field === "line") {
        return { ...state, lines: dropValue(state.lines, value as LineId) };
    }
    if (field === "tech") {
        return { ...state, tech: dropValue(state.tech, value) };
    }
    if (field === "floors") {
        return { ...state, floors: dropValue(state.floors, value) };
    }
    if (field === "rooms") {
        return { ...state, rooms: dropValue(state.rooms, Number(value)) };
    }
    if (field === "baths") {
        return { ...state, baths: dropValue(state.baths, Number(value)) };
    }
    return state;
}
