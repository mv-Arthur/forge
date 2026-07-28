interface PlaceholderMediaProps {
    /** Ширина исходника, который сюда встанет. */
    width: number;
    /** Высота исходника. */
    height: number;
    /** Что именно ожидается на этом месте — «Котельная», «Фасад, зима». */
    label?: string;
    /** Для тёмной подложки (лайтбокс): светлый текст вместо тёмного. */
    dark?: boolean;
    className?: string;
}

/**
 * Место под фото, которого ещё нет. Показывает ожидаемый размер, чтобы на
 * превью было видно, какие исходники нужно собрать у заказчика.
 */
export function PlaceholderMedia({
    width,
    height,
    label,
    dark = false,
    className = "",
}: PlaceholderMediaProps) {
    return (
        <div
            className={`relative grid place-items-center overflow-hidden rounded-xl border border-dashed ${
                dark
                    ? "border-white/25 bg-ink-900"
                    : "border-line-strong bg-ink-100"
            } ${className}`}
        >
            {dark ? null : (
                <div className="pointer-events-none absolute inset-0 noise-bg" />
            )}
            <div className="relative px-3 text-center">
                <div
                    className={`font-mono text-[13px] font-semibold ${
                        dark ? "text-white" : "text-ink-600"
                    }`}
                >
                    {width} × {height}
                </div>
                {label ? (
                    <div
                        className={`mt-1 text-[12px] leading-tight ${
                            dark ? "text-white/70" : "text-ink-500"
                        }`}
                    >
                        {label}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
