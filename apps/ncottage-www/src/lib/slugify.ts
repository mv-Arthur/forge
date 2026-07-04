// Транслитерация кириллицы в безопасный для URL-фрагмента/id слаг (латиница,
// цифры, дефисы). Нужно для якорей по человекочитаемым русским заголовкам, где
// сырые id с пробелами и кириллицей дают невалидный fragment.
const TRANSLIT: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
};

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .split("")
        .map((char) => TRANSLIT[char] ?? char)
        .join("")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
