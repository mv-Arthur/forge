// Делает деградацию заметной: когда фетч к ncottage-api падает и слой данных
// отдаёт статический сид вместо живого CMS, об этом остаётся запись в серверном
// логе, а не молчаливая подмена.
export function warnApiFallback(resource: string, error: unknown): void {
    console.warn(
        `[ncottage-www] не удалось загрузить «${resource}» из API — отдаю статический фолбэк`,
        error instanceof Error ? error.message : error
    );
}
