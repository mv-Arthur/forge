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
export const bedroomsWord = (n: number) =>
    pluralize(n, ["спальня", "спальни", "спален"]);
export const bathroomsWord = (n: number) =>
    pluralize(n, ["санузел", "санузла", "санузлов"]);
export const photosWord = (n: number) =>
    pluralize(n, ["фото", "фото", "фото"]);

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
