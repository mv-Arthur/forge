import type { EnrichedBuiltObject } from "@/lib/types";
import { MapPinIcon } from "./Icons";

/** Иллюстративные якоря для превью (без Leaflet). */
const CITY_ANCHORS: Record<
    string,
    { top: string; left: string; label: string }
> = {
    Yukki: { top: "36%", left: "42%", label: "Юкки" },
    Kiskelovo: { top: "24%", left: "58%", label: "Кискелово" },
    Istinka: { top: "48%", left: "34%", label: "Истинка" },
    "Lodejnoe Pole": { top: "18%", left: "72%", label: "Лодейное Поле" },
    Toksovo: { top: "30%", left: "48%", label: "Токсово" },
    Solnechnoe: { top: "42%", left: "28%", label: "Солнечное" },
    Mga: { top: "55%", left: "62%", label: "Мга" },
    Virkino: { top: "40%", left: "55%", label: "Виркино" },
    Kellozi: { top: "33%", left: "38%", label: "Келлози" },
    Ogonkovo: { top: "50%", left: "45%", label: "Огоньково" },
    Kommunar: { top: "58%", left: "48%", label: "Коммунар" },
    Vartemyagi: { top: "32%", left: "40%", label: "Вартемяги" },
    "Severnaya Zhemchuzhina": {
        top: "28%",
        left: "36%",
        label: "Северная жемчужина",
    },
    "Petergofskie Dachi": {
        top: "52%",
        left: "30%",
        label: "Петергофские дачи",
    },
    Annino: { top: "54%", left: "38%", label: "Аннино" },
    "Sertolovo Snt Modul": { top: "34%", left: "44%", label: "Сертолово" },
    "Mistolovo Po Proektu Bavariya": {
        top: "26%",
        left: "54%",
        label: "Мистолово",
    },
    default: { top: "50%", left: "50%", label: "Ленобласть" },
};

function hashPos(slug: string, mul: number, base: number, span: number) {
    let h = 0;
    for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * mul) % span;
    return base + h;
}

function resolveAnchor(object: EnrichedBuiltObject) {
    if (object.location && CITY_ANCHORS[object.location]) {
        return CITY_ANCHORS[object.location];
    }
    return {
        top: `${hashPos(object.slug, 7, 22, 45)}%`,
        left: `${hashPos(object.slug, 11, 20, 50)}%`,
        label: object.locationLabel || "Ленобласть",
    };
}

/**
 * Где объект: статичное превью-карта (без Leaflet).
 */
export function ObjectLocationMap({
    object,
}: {
    object: EnrichedBuiltObject;
}) {
    const anchor = resolveAnchor(object);
    const region =
        object.locationLabel === "Ленобласть"
            ? "Ленинградская область"
            : `${object.locationLabel}, Ленинградская область`;

    return (
        <section className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <div className="eyebrow">Локация</div>
                    <h2 className="mt-1 font-display text-h2">
                        Где этот объект
                    </h2>
                    <p className="mt-1 text-[13px] text-ink-500">{region}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-ink-150 bg-ink-50 px-3 py-1.5 text-[13px] font-semibold text-ink-900">
                    <MapPinIcon className="h-4 w-4 text-accent" />
                    {object.locationLabel}
                </div>
            </div>

            <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-ink-150 bg-[#e8efe6] sm:min-h-[340px] sm:aspect-[16/9]">
                <MapPattern />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(156,74,45,0.08),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(71,147,50,0.1),transparent_40%)]" />

                <div className="absolute bottom-3 left-3 z-10 rounded-md bg-white/95 px-3 py-1 text-[11px] font-semibold text-ink-700 shadow">
                    Превью карты
                </div>

                <div
                    className="absolute z-[1] -translate-x-1/2 -translate-y-full"
                    style={{ top: anchor.top, left: anchor.left }}
                >
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
                            <div className="relative grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-ink shadow-lift ring-4 ring-white">
                                <MapPinIcon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-1.5 max-w-[160px] rounded-md bg-ink-950 px-2.5 py-1 text-center text-[12px] font-semibold text-white shadow">
                            {anchor.label}
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
                Точный адрес и схема проезда — после записи на просмотр.
            </p>
        </section>
    );
}

function MapPattern() {
    return (
        <svg
            className="absolute inset-0 h-full w-full opacity-40"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <defs>
                <pattern
                    id="object-map-grid"
                    width="32"
                    height="32"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M32 0H0V32"
                        fill="none"
                        stroke="#cfc9bc"
                        strokeWidth="0.5"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#object-map-grid)" />
            <circle cx="40%" cy="45%" r="18%" fill="#e9e2d2" opacity="0.5" />
            <circle cx="62%" cy="35%" r="12%" fill="#e6e2d9" opacity="0.4" />
        </svg>
    );
}
