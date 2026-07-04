// Рендерит структурированные данные schema.org как <script type="application/ld+json">.
// Принимает один объект-тип или массив (массив оборачивается в @graph). Экранирует
// "<", чтобы payload нельзя было вырваться из тега script.
export function JsonLd({
    data,
}: {
    data: Record<string, unknown> | Record<string, unknown>[];
}) {
    const payload = Array.isArray(data)
        ? { "@context": "https://schema.org", "@graph": data }
        : { "@context": "https://schema.org", ...data };
    const json = JSON.stringify(payload).replace(/</g, "\\u003c");
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
        />
    );
}
