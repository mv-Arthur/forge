/** Текст ошибки из unknown, чтобы писать в лог. */
export function errMsg(e: unknown): string {
    return e instanceof Error ? e.message : String(e);
}
