// Человекочитаемые подписи страниц и их секций для админки. Секции приходят из
// API в фиксированном порядке (по seed); подписи сопоставляются по индексу.

export const PAGE_DESCRIPTIONS: Record<string, string> = {
    about: "Герой, факты, принципы, команда, история, призыв",
    production: "Герой, возможности, процесс, стандарты",
    mortgage: "Ипотека: герой, условия, этапы, форматы, форма",
    credit: "Кредит: герой, условия, этапы, форматы, форма",
    "maternity-capital": "Маткапитал: герой, условия, этапы, сценарии, форма",
    payment: "Оплата и доставка: герой, условия, этапы, форматы, форма",
    contacts: "Герой, офисы, производство, форма",
    works: "Герой, карта, объекты, запись на просмотр",
    guarantee: "Герой, условия, случаи, исключения, форма",
    privacy: "Политика конфиденциальности",
    offer: "Публичная оферта",
    requisites: "Реквизиты компании",
    "personal-data": "Согласие на обработку данных",
};

export const PAGE_SECTION_LABELS: Record<string, string[]> = {
    about: [
        "Герой",
        "Факты",
        "Принципы",
        "Команда",
        "История",
        "Призыв к действию",
    ],
};

export function sectionLabel(
    pageKey: string,
    index: number,
    fallback: string
): string {
    return PAGE_SECTION_LABELS[pageKey]?.[index] ?? fallback;
}
