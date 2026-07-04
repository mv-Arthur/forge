import { BadRequestException } from "@nestjs/common";

// Возвращает запрошенные значения, которых нет среди существующих.
export function findMissing(
    requested: readonly string[],
    existing: Iterable<string>
): string[] {
    const have = new Set(existing);
    return [...new Set(requested)].filter((value) => !have.has(value));
}

// Бросает 400, если какие-то soft-ссылки указывают на несуществующие записи.
export function assertRefsExist(label: string, missing: string[]): void {
    if (missing.length > 0) {
        throw new BadRequestException(
            `Несуществующие ссылки (${label}): ${missing.join(", ")}`
        );
    }
}

// Слаг — стабильный идентификатор с входящими soft-ссылками: запрещаем менять
// его при обновлении (иначе ссылки осиротеют без каскада).
export function assertSlugImmutable(
    current: string,
    next: string | undefined
): void {
    if (next !== undefined && next !== current) {
        throw new BadRequestException(
            "Слаг нельзя изменить после создания записи"
        );
    }
}
