export type CityCode = "spb" | "msk";

export type City = { code: CityCode; label: string };

export type Phone = { number: string; display: string };

export const CITIES: City[] = [
    { code: "spb", label: "Санкт-Петербург" },
    { code: "msk", label: "Москва" },
];

export const PHONES: Record<CityCode, Phone> = {
    spb: { number: "+78123093818", display: "+7 (812) 309-38-18" },
    msk: { number: "+74952043856", display: "+7 (495) 204-38-56" },
};

export const EMAIL = "info@ncottage.ru";

export const ADDRESSES = {
    spb: "Санкт-Петербург, Комендантский проспект, д. 4",
    msk: "Москва, Варшавское шоссе, 35, стр. 1, БЦ «Ривер Плаза», офис 412",
    lenobl: "Ленинградская область, Всеволожский район, д. Лепсари, промзона Спутник 4 проезд",
    novobl: "Новгородская область, Окуловский район, с/п Боровёнковское",
};

export const SOCIAL = {
    vk: "https://vk.com/ncottage",
    telegram: "https://t.me/ncottage",
    whatsapp: "https://wa.me/78123093818",
    website: "https://ncottage.ru",
};

export const WORK_HOURS = "Пн–Пт: 10:00–19:00";

export const LEGAL = {
    ogrn: "1187847109823",
    inn: "7802663069",
    kpp: "781401001",
};
