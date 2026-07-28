import type { Settings } from "./types";

export const settings: Settings = {
    phone: "+7 (812) 309-38-18",
    phoneClean: "+78123093818",
    telegram: "https://t.me/ncottage",
    whatsapp: "https://wa.me/78125003818",
    mortgageRate: 6,
    mortgageTermYears: 20,
    warrantyYears: 7,
    yearsOnMarket: 12,
    builtHouses: 640,
    metersProduced: 82000,
    recommendRate: 97,
    officeHoursLabel: "Пн–Пт: 10:00–19:00",
    cityLabel: "Санкт-Петербург",
};

export function telegramLink(prefill?: string): string {
    if (!prefill) return settings.telegram;
    return `${settings.telegram}?text=${encodeURIComponent(prefill)}`;
}

export function whatsappLink(prefill?: string): string {
    if (!prefill) return settings.whatsapp;
    return `${settings.whatsapp}?text=${encodeURIComponent(prefill)}`;
}
