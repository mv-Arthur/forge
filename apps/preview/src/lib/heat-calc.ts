export const MONTH_NAMES = [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июнь",
    "июль",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
] as const;

export const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const SUMMER = new Set([4, 5, 6, 7, 8]);
const FLOOR_R = 4.580665;

export type HeatEnvelope = {
    walls: number;
    roof: number;
    floor: number;
    windows: number;
    doors: number;
};

export type HeatOption = {
    id: string;
    name: string;
    r0: number;
    default?: boolean;
};

export type HeatFuel = {
    id: string;
    name: string;
    unit: string;
    price: number;
    kwh: number;
};

export type HeatCity = {
    id: string;
    name: string;
    temps: number[];
};

export type HeatInput = {
    envelope: HeatEnvelope;
    tIn: number;
    wallR: number;
    roofR: number;
    windowR: number;
    fuelPrice: number;
    fuelKwh: number;
    temps: number[];
    skipSummer: boolean;
};

export type HeatMonth = {
    name: string;
    temp: number;
    kwh: number;
    price: number;
    color: string;
    bar: number;
};

export type HeatResult = {
    perDegree: number;
    yearlyKwh: number;
    yearlyPrice: number;
    monthlyPrice: number;
    powerPrice: number;
    months: HeatMonth[];
};

export function heatLossPerDegree(
    envelope: HeatEnvelope,
    wallR: number,
    roofR: number,
    windowR: number,
): number {
    const u =
        envelope.walls / wallR +
        envelope.roof / roofR +
        envelope.floor / FLOOR_R +
        envelope.windows / windowR +
        envelope.doors / windowR;
    return u / 1000;
}

export function monthBar(temp: number): number {
    return Math.min(1, Math.max(0, (temp + 25) / 50));
}

export function monthColor(temp: number): string {
    if (temp <= -6) return "#9BD2FF";
    if (temp <= 13) return "#C6E2FF";
    if (temp <= 20) return "#FCBC8E";
    return "#FCA98E";
}

export function calculateHeat(input: HeatInput): HeatResult {
    const perDegree = heatLossPerDegree(
        input.envelope,
        input.wallR,
        input.roofR,
        input.windowR,
    );
    const powerPrice = input.fuelPrice * input.fuelKwh;
    const months: HeatMonth[] = MONTH_NAMES.map((name, i) => {
        const temp = input.temps[i] ?? 0;
        const skip = input.skipSummer && SUMMER.has(i);
        const hours = MONTH_DAYS[i] * 24;
        const rawKwh = skip
            ? 0
            : Math.max(0, input.tIn - temp) * perDegree * hours;
        const kwh = Math.round(rawKwh * 1000) / 1000;
        const price = Math.round(kwh * powerPrice);
        return {
            name,
            temp,
            kwh,
            price,
            color: monthColor(temp),
            bar: monthBar(temp),
        };
    });
    const yearlyKwh = months.reduce((s, m) => s + m.kwh, 0);
    const yearlyPrice = months.reduce((s, m) => s + m.price, 0);
    return {
        perDegree,
        yearlyKwh,
        yearlyPrice,
        monthlyPrice: yearlyPrice / 12,
        powerPrice,
        months,
    };
}

export function formatRub(value: number): string {
    return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

export function formatKwh(value: number): string {
    return `${Math.round(value).toLocaleString("ru-RU")} кВт·ч`;
}

export function formatKwPerC(value: number): string {
    return `${value.toFixed(3)} кВт/°C`;
}
