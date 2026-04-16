export function formatPrice(price: number): string {
    return new Intl.NumberFormat("ru-RU").format(price) + " \u20BD";
}

export function formatArea(area: number): string {
    return `${area} \u043C\u00B2`;
}

export function cn(...classes: (string | undefined | false)[]): string {
    return classes.filter(Boolean).join(" ");
}
