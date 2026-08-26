import { settings } from "./settings";

const priceFormatter = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
});

export function formatPrice(value: number | null | undefined): string {
    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(value) ||
        value <= 0
    )
        return "—";
    if (value >= 1_000_000) {
        const millions = value / 1_000_000;
        const label = millions.toFixed(1).replace(".", ",");
        return `${label} млн ₽`;
    }
    return `${priceFormatter.format(Math.round(value))} ₽`;
}

export function formatMillions(value: number | null | undefined): string {
    return formatPrice(value);
}

export function formatArea(value: number | null | undefined): string {
    if (!value) return "—";
    return `${value} м²`;
}

export function formatFloors(floors: string | null | undefined): string {
    if (!floors) return "—";
    switch (floors) {
        case "1":
            return "1 этаж";
        case "1.5":
            return "1,5 этажа";
        case "2":
            return "2 этажа";
        case "mansard":
            return "с мансардой";
        default:
            return String(floors);
    }
}

export function formatFloorsShort(floors: string | null | undefined): string {
    if (!floors) return "—";
    switch (floors) {
        case "1":
            return "1 эт";
        case "1.5":
            return "1,5 эт";
        case "2":
            return "2 эт";
        case "mansard":
            return "манс";
        default:
            return String(floors);
    }
}

export function formatTechnology(tech: string | null | undefined): string {
    switch (tech) {
        case "frame":
            return "каркас";
        case "gas_concrete":
            return "газобетон";
        case "brick":
            return "кирпич";
        case "sip":
            return "СИП";
        case "fachwerk":
            return "фахверк";
        default:
            return tech ?? "—";
    }
}

export function formatTechnologyBrand(tech: string | null | undefined): string {
    switch (tech) {
        case "frame":
            return "Каркас";
        case "gas_concrete":
            return "Газобетон";
        case "brick":
            return "Кирпич";
        case "sip":
            return "СИП";
        case "fachwerk":
            return "Фахверк";
        default:
            return tech ?? "—";
    }
}

export function formatStyle(style: string | null | undefined): string {
    switch (style) {
        case "scandinavian":
            return "Скандинавский";
        case "modern":
            return "Модерн";
        case "classic":
            return "Классический";
        case "loft":
            return "Лофт";
        case "barn":
            return "Барн";
        case "provance":
            return "Прованс";
        case "european":
            return "Европейский";
        default:
            return style ?? "—";
    }
}

export function formatPurpose(v: string | null | undefined): string {
    switch (v) {
        case "permanent":
            return "ПМЖ";
        case "seasonal":
            return "Сезонный";
        case "guest":
            return "Гостевой";
        default:
            return v ?? "—";
    }
}

export function formatFeature(feature: string): string {
    switch (feature) {
        case "terrace":
            return "терраса";
        case "balcony":
            return "балкон";
        case "garage":
            return "гараж";
        case "sauna":
            return "сауна";
        case "panoramic":
            return "панорамные окна";
        case "second-light":
            return "второй свет";
        default:
            return feature;
    }
}

export function pluralize(n: number, forms: [string, string, string]): string {
    const abs = Math.abs(n) % 100;
    const mod10 = abs % 10;
    if (abs > 10 && abs < 20) return forms[2];
    if (mod10 > 1 && mod10 < 5) return forms[1];
    if (mod10 === 1) return forms[0];
    return forms[2];
}

export const projectsWord = (n: number) =>
    pluralize(n, ["проект", "проекта", "проектов"]);
export const housesWord = (n: number) =>
    pluralize(n, ["дом", "дома", "домов"]);
export const objectsWord = (n: number) => housesWord(n);
export const bedroomsWord = (n: number) =>
    pluralize(n, ["спальня", "спальни", "спален"]);
export const bathroomsWord = (n: number) =>
    pluralize(n, ["санузел", "санузла", "санузлов"]);
export const photosWord = (n: number) =>
    pluralize(n, ["фото", "фото", "фото"]);
export const timesWord = (n: number) =>
    pluralize(n, ["раз", "раза", "раз"]);

/** Заголовок блока построенных домов на карточке проекта — только по факту статусов. */
export function projectObjectsHeadline(
    built: number,
    building: number,
): { title: string; lead: string } {
    if (built <= 0 && building <= 0) {
        return { title: "", lead: "" };
    }
    if (building <= 0) {
        return {
            title:
                built === 1
                    ? "1 дом построен по этому проекту"
                    : `${built} ${housesWord(built)} построено по этому проекту`,
            lead: "Покажем дом изнутри и снаружи.",
        };
    }
    if (built <= 0) {
        return {
            title:
                building === 1
                    ? "1 дом строится по этому проекту"
                    : `${building} ${housesWord(building)} строятся по этому проекту`,
            lead: "Покажем текущий этап стройки.",
        };
    }
    const total = built + building;
    const builtPart =
        built === 1 ? "1 сдан" : `${built} сдано`;
    const buildingPart =
        building === 1 ? "1 строится" : `${building} строятся`;
    return {
        title: `${total} ${housesWord(total)} по этому проекту`,
        lead: `${builtPart} · ${buildingPart}. Приезжайте — покажем дом.`,
    };
}

/** Короткая метка для карточки/summary: «построен N×» / «строится». */
export function projectObjectsBadge(
    built: number,
    building: number,
): string | null {
    if (built > 0) {
        return `построен ${built} ${timesWord(built)}`;
    }
    if (building > 0) {
        return building === 1
            ? "сейчас строится"
            : `строится ${building} ${housesWord(building)}`;
    }
    return null;
}

export function mortgageMonthly(
    price: number,
    rate = settings.mortgageRate,
    termYears = settings.mortgageTermYears,
): number {
    const monthlyRate = rate / 100 / 12;
    const months = termYears * 12;
    if (monthlyRate === 0) return Math.round(price / months);
    const payment =
        (price * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return Math.round(payment);
}

export function formatMonthlyShort(price: number): string {
    const m = mortgageMonthly(price);
    if (m >= 100000)
        return `${(m / 1000).toFixed(0)} тыс ₽/мес`;
    return `${m.toLocaleString("ru-RU")} ₽/мес`;
}

export function formatDateRu(iso: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    const months = [
        "янв", "фев", "мар", "апр", "мая", "июн",
        "июл", "авг", "сен", "окт", "ноя", "дек",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
