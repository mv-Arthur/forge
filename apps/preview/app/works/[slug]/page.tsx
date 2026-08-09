import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllObjects, getObject } from "@/lib/data";
import {
    formatArea,
    formatFloors,
    formatTechnologyBrand,
    photosWord,
} from "@/lib/format";
import { settings, telegramLink, whatsappLink } from "@/lib/settings";
import { PhotoChronicle } from "@/components/PhotoChronicle";
import { LeadForm } from "@/components/LeadForm";
import { BuiltObjectCard } from "@/components/BuiltObjectCard";
import { ObjectLocationMap } from "@/components/ObjectLocationMap";
import {
    BathIcon,
    BedIcon,
    MapPinIcon,
    PhoneIcon,
    RulerIcon,
    StairsIcon,
    TelegramIcon,
    WhatsappIcon,
} from "@/components/Icons";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllObjects().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const o = getObject(slug);
    return {
        title: o ? `${o.displayTitle} · Новый Коттедж` : "Объект не найден",
    };
}

export default async function BuiltObjectPage({ params }: Props) {
    const { slug } = await params;
    const obj = getObject(slug);
    if (!obj) notFound();
    const otherObjects = getAllObjects()
        .filter((o) => o.slug !== obj.slug)
        .sort((a, b) => b.gallery.length - a.gallery.length)
        .slice(0, 3);
    const prefill = `Объект: ${obj.displayTitle}`;

    const facts: Array<{ icon: React.ReactNode; label: string; value: string }> =
        [];
    if (obj.area != null) {
        facts.push({
            icon: <RulerIcon className="h-4 w-4" />,
            label: "Площадь",
            value: formatArea(obj.area),
        });
    }
    if (obj.floors) {
        facts.push({
            icon: <StairsIcon className="h-4 w-4" />,
            label: "Этажность",
            value: formatFloors(obj.floors),
        });
    }
    if (obj.bedrooms != null) {
        facts.push({
            icon: <BedIcon className="h-4 w-4" />,
            label: "Спальни",
            value: String(obj.bedrooms),
        });
    }
    if (obj.bathrooms != null) {
        facts.push({
            icon: <BathIcon className="h-4 w-4" />,
            label: "Санузлы",
            value: String(obj.bathrooms),
        });
    }
    if (obj.technology) {
        facts.push({
            icon: <RulerIcon className="h-4 w-4" />,
            label: "Материал",
            value: formatTechnologyBrand(obj.technology),
        });
    }

    return (
        <main className="pb-28">
            <div className="border-b border-ink-150 bg-white">
                <div className="container-page py-4 text-[12px] text-ink-500">
                    <Link href="/" className="hover:text-ink-950">
                        Главная
                    </Link>{" "}
                    ·{" "}
                    <Link href="/works" className="hover:text-ink-950">
                        Построенные объекты
                    </Link>{" "}
                    ·{" "}
                    <span className="text-ink-700 line-clamp-1">
                        {obj.displayTitle}
                    </span>
                </div>
            </div>

            <section className="border-b border-ink-150 bg-white">
                <div className="container-page py-5 md:py-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`badge ${
                                obj.status === "built"
                                    ? "badge-built"
                                    : "badge-progress"
                            }`}
                        >
                            {obj.status === "built"
                                ? "Построен и сдан"
                                : "Строится"}
                        </span>
                        {obj.locationLabel ? (
                            <span className="badge badge-outline inline-flex items-center gap-1">
                                <MapPinIcon className="h-3 w-3" />
                                {obj.locationLabel}
                            </span>
                        ) : null}
                        {obj.technology ? (
                            <span className="badge badge-outline">
                                {formatTechnologyBrand(obj.technology)}
                            </span>
                        ) : null}
                    </div>
                    <h1 className="mt-3 max-w-3xl font-display text-display-2 text-ink-950">
                        {obj.displayTitle}
                    </h1>
                    {obj.gallery.length > 0 ? (
                        <p className="mt-2 text-sm text-ink-500">
                            {obj.gallery.length}{" "}
                            {photosWord(obj.gallery.length)} в галерее
                        </p>
                    ) : null}
                </div>
            </section>

            {obj.heroImage ? (
                <section className="border-b border-ink-150 bg-ink-50">
                    <div className="container-page py-6">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100">
                            <Image
                                src={obj.heroImage}
                                alt={obj.displayTitle}
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </section>
            ) : null}

            <div className="container-page py-10 space-y-10 md:py-14">
                {facts.length > 0 ? (
                    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {facts.map((f) => (
                            <div
                                key={f.label}
                                className="rounded-xl border border-ink-150 bg-white p-4"
                            >
                                <div className="flex items-center gap-2 text-ink-500">
                                    {f.icon}
                                    <span className="text-xs uppercase tracking-wider">
                                        {f.label}
                                    </span>
                                </div>
                                <div className="mt-2 font-display text-lg font-extrabold text-ink-950">
                                    {f.value}
                                </div>
                            </div>
                        ))}
                    </section>
                ) : null}

                {(obj.hasSauna || obj.hasGarage || obj.buildTermLabel) && (
                    <section className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
                        <div className="eyebrow">Из карточки объекта</div>
                        <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
                            {obj.hasSauna ? <li>Сауна</li> : null}
                            {obj.hasGarage ? <li>Гараж</li> : null}
                            {obj.buildTermLabel ? (
                                <li>Срок: {obj.buildTermLabel}</li>
                            ) : null}
                        </ul>
                    </section>
                )}

                <PhotoChronicle object={obj} />

                <ObjectLocationMap object={obj} />

                <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
                        <div className="eyebrow">Запись на показ</div>
                        <h2 className="mt-1 font-display text-h2">
                            Хотите посмотреть вживую?
                        </h2>
                        <p className="mt-2 text-sm text-ink-500">
                            Оставьте контакты — согласуем время и маршрут.
                        </p>
                        <div className="mt-5">
                            <LeadForm
                                source="works-detail"
                                prefill={prefill}
                            />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-ink-150 bg-ink-50/50 p-5 md:p-6">
                        <div className="text-sm font-semibold text-ink-950">
                            Быстрая связь
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <a
                                href={`tel:${settings.phoneClean}`}
                                className="btn btn-light w-full"
                            >
                                <PhoneIcon className="h-4 w-4" />{" "}
                                {settings.phone}
                            </a>
                            <a
                                href={telegramLink(prefill)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-tg w-full"
                            >
                                <TelegramIcon className="h-4 w-4" /> Telegram
                            </a>
                            <a
                                href={whatsappLink(prefill)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-wa w-full"
                            >
                                <WhatsappIcon className="h-4 w-4" /> WhatsApp
                            </a>
                        </div>
                        <p className="mt-4 text-[13px] text-ink-500">
                            {settings.officeHoursLabel} · {settings.cityLabel}
                        </p>
                    </div>
                </section>

                {otherObjects.length > 0 ? (
                    <section>
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <div className="eyebrow">Ещё объекты</div>
                                <h2 className="mt-1 font-display text-h2">
                                    Смотрите также
                                </h2>
                            </div>
                            <Link
                                href="/works"
                                className="text-sm font-semibold text-ink-950 hover:text-accent"
                            >
                                Все объекты →
                            </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {otherObjects.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </main>
    );
}
