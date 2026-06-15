export type TemplateValue = string | number | boolean | null | undefined;

export type TemplateValues = Record<string, TemplateValue>;

const tokenPattern = /\{\{\s*([A-Za-z][A-Za-z0-9_.-]*)\s*\}\}/g;

export function renderTemplate(
    template: string,
    values: TemplateValues
): string {
    return template.replace(tokenPattern, (_token, key: string) => {
        if (!Object.prototype.hasOwnProperty.call(values, key)) {
            throw new Error(`Template value is missing: ${key}`);
        }

        const value = values[key];

        return value == null ? "" : String(value);
    });
}
