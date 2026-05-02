export function formatPrice(price: number): string {
    return new Intl.NumberFormat("ru-RU").format(price) + " \u20BD";
}

export function formatArea(area: number): string {
    return `${area} \u043C\u00B2`;
}
