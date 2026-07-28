import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllObjects, getObject, getProject } from "@/lib/data";
import {
    formatArea,
    formatDateRu,
    formatFloors,
    formatPrice,
    formatTechnologyBrand,
    photosWord,
} from "@/lib/format";
import { settings, telegramLink, whatsappLink } from "@/lib/settings";
import { PhotoChronicle } from "@/components/PhotoChronicle";
import { LeadForm } from "@/components/LeadForm";
import { BuiltObjectCard } from "@/components/BuiltObjectCard";
import { ObjectLocationMap } from "@/components/ObjectLocationMap";
import {
    ArrowRightIcon,
    BedIcon,
    BathIcon,
    CameraIcon,
    CheckIcon,
    HouseIcon,
    MapPinIcon,
    PhoneIcon,
    RulerIcon,
    ShieldIcon,
    StairsIcon,
    StarIcon,
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
    const baseProject = obj.baseProjectSlug
        ? getProject(obj.baseProjectSlug)
        : null;
    const otherObjects = getAllObjects()
        .filter((o) => o.slug !== obj.slug)
        .sort((a, b) => b.gallery.length - a.gallery.length)
        .slice(0, 3);
    const prefill = `Объект: ${obj.displayTitle}`;

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
                                : `Строится · ${obj.progress}%`}
                        </span>
                        <span className="badge badge-outline inline-flex items-center gap-1">
                            <MapPinIcon className="h-3 w-3" />
                            {obj.locationLabel}
                        </span>
                        <span className="badge badge-outline inline-flex items-center gap-1">
                            <CameraIcon className="h-3 w-3" />
                            {obj.gallery.length} {photosWord(obj.gallery.length)}
                        </span>
                        <span className="badge badge-outline">
                            {formatTechnologyBrand(obj.technology)}
                        </span>
                    </div>

                    <h1 className="mt-4 max-w-4xl font-display text-display-2 leading-[1.08] tracking-tight">
                        {obj.displayTitle}
                    </h1>

                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        <Stat
                            icon={<RulerIcon className="h-4 w-4" />}
                            label="Площадь"
                            value={formatArea(obj.area)}
                        />
                        <Stat
                            icon={<HouseIcon className="h-4 w-4" />}
                            label="Жилая"
                            value={formatArea(obj.livingArea)}
                        />
                        <Stat
                            icon={<StairsIcon className="h-4 w-4" />}
                            label="Этажи"
                            value={formatFloors(obj.floors)}
                        />
                        <Stat
                            icon={<BedIcon className="h-4 w-4" />}
                            label="Спальни"
                            value={String(obj.bedrooms)}
                        />
                        <Stat
                            icon={<BathIcon className="h-4 w-4" />}
                            label="С/У"
                            value={String(obj.bathrooms)}
                        />
                        <Stat
                            icon={<CameraIcon className="h-4 w-4" />}
                            label="Срок"
                            value={`${obj.durationMonths} мес.`}
                        />
                    </div>
                </div>
            </section>

            <div className="container-page py-6 md:py-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
                    <div className="min-w-0 space-y-8">
                        <section id="chronicle" className="scroll-mt-24">
                            <PhotoChronicle object={obj} />
                        </section>

                        <section id="map" className="scroll-mt-24">
                            <ObjectLocationMap object={obj} />
                        </section>

                        <section
                            id="params"
                            className="scroll-mt-24 rounded-2xl border border-ink-150 bg-white p-5 md:p-6"
                        >
                            <div className="eyebrow">Параметры</div>
                            <h2 className="mt-1 font-display text-h2">
                                Данные объекта
                            </h2>
                            <dl className="mt-4 grid gap-x-8 md:grid-cols-2">
                                <Row
                                    label="Технология"
                                    value={formatTechnologyBrand(
                                        obj.technology,
                                    )}
                                />
                                <Row label="Тип" value={obj.objectType} />
                                <Row
                                    label="Общая площадь"
                                    value={formatArea(obj.area)}
                                />
                                <Row
                                    label="Жилая"
                                    value={formatArea(obj.livingArea)}
                                />
                                {obj.kitchenArea ? (
                                    <Row
                                        label="Кухня-гостиная"
                                        value={`${obj.kitchenArea} м²`}
                                    />
                                ) : null}
                                <Row
                                    label="Этажность"
                                    value={formatFloors(obj.floors)}
                                />
                                <Row
                                    label="Спальни"
                                    value={String(obj.bedrooms)}
                                />
                                <Row
                                    label="Санузлы"
                                    value={String(obj.bathrooms)}
                                />
                                <Row
                                    label="Локация"
                                    value={
                                        obj.locationLabel === "Ленобласть"
                                            ? "Ленинградская область"
                                            : `${obj.locationLabel}, Ленобласть`
                                    }
                                />
                                <Row
                                    label="Срок работ"
                                    value={obj.buildTermLabel}
                                />
                                <Row
                                    label="Договор"
                                    value={formatDateRu(obj.contractDate)}
                                />
                                <Row
                                    label="Старт"
                                    value={formatDateRu(obj.buildStartDate)}
                                />
                                <Row
                                    label={
                                        obj.status === "built"
                                            ? "Заселение"
                                            : "План заселения"
                                    }
                                    value={
                                        obj.moveInDate
                                            ? formatDateRu(obj.moveInDate)
                                            : "по графику"
                                    }
                                />
                                {obj.showPrice && obj.price ? (
                                    <Row
                                        label="Стоимость"
                                        value={formatPrice(obj.price)}
                                    />
                                ) : null}
                                <Row
                                    label="Содержание зимой"
                                    value={obj.utilityCost}
                                />
                                <Row label="Прораб" value={obj.foreman} />
                            </dl>
                            {obj.features.length > 0 ? (
                                <div className="mt-5 border-t border-ink-150 pt-4">
                                    <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">
                                        Особенности
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {obj.features.map((f) => (
                                            <span
                                                key={f}
                                                className="rounded-full border border-ink-150 bg-ink-50 px-3 py-1 text-[12px] font-medium text-ink-800"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </section>

                        <section
                            id="timeline"
                            className="scroll-mt-24 rounded-2xl border border-ink-150 bg-white p-5 md:p-6"
                        >
                            <div className="eyebrow">График</div>
                            <h2 className="mt-1 font-display text-h2">
                                Договор → сдача
                            </h2>
                            <ol className="mt-5 space-y-0">
                                {obj.milestones.map((m, i) => (
                                    <li
                                        key={m.label}
                                        className="relative flex gap-4 pb-5 last:pb-0"
                                    >
                                        {i < obj.milestones.length - 1 ? (
                                            <span className="absolute left-[11px] top-6 h-[calc(100%-10px)] w-px bg-ink-150" />
                                        ) : null}
                                        <span
                                            className={`relative z-10 mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border-2 text-[10px] font-bold ${
                                                m.done
                                                    ? "border-ink-950 bg-ink-950 text-white"
                                                    : "border-ink-200 bg-white text-ink-500"
                                            }`}
                                        >
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0 flex-1 border-b border-ink-100 pb-4">
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <div className="font-semibold text-ink-950">
                                                    {m.label}
                                                </div>
                                                <div className="text-[12px] tabular-nums text-ink-500">
                                                    {formatDateRu(m.date)}
                                                </div>
                                            </div>
                                            {m.note ? (
                                                <div className="mt-0.5 text-[13px] text-ink-500">
                                                    {m.note}
                                                </div>
                                            ) : null}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                            {obj.status === "in-progress" ? (
                                <div className="mt-2">
                                    <div className="mb-1 flex justify-between text-[12px] text-ink-500">
                                        <span>Готовность</span>
                                        <span className="font-semibold text-ink-950">
                                            {obj.progress}%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                                        <div
                                            className="h-full rounded-full bg-accent"
                                            style={{
                                                width: `${obj.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </section>

                        {baseProject ? (
                            <section className="overflow-hidden rounded-2xl border border-ink-150 bg-white">
                                <div className="grid sm:grid-cols-[160px_1fr]">
                                    <div className="relative min-h-[140px] bg-ink-100 sm:min-h-full">
                                        {baseProject.renders[0] ? (
                                            <Image
                                                src={baseProject.renders[0]}
                                                alt={baseProject.displayName}
                                                fill
                                                sizes="160px"
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="eyebrow">
                                            Кросс-продажа
                                        </div>
                                        <h2 className="mt-1 font-display text-h3">
                                            Хотите такой же дом?
                                        </h2>
                                        <p className="mt-2 text-[14px] text-ink-500">
                                            Объект связан с проектом «
                                            {baseProject.displayName}». Можно
                                            повторить 1-в-1 или с
                                            перепланировкой.
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-3 text-[13px] text-ink-700">
                                            <span>
                                                {formatArea(baseProject.area)}
                                            </span>
                                            <span>
                                                от{" "}
                                                {formatPrice(
                                                    baseProject.priceFrom,
                                                )}
                                            </span>
                                            {baseProject.builtCount > 0 ? (
                                                <span>
                                                    построен{" "}
                                                    {baseProject.builtCount}×
                                                </span>
                                            ) : baseProject.buildingCount >
                                              0 ? (
                                                <span>сейчас строится</span>
                                            ) : null}
                                        </div>
                                        <Link
                                            href={`/projects/${baseProject.slug}`}
                                            className="btn btn-primary mt-4"
                                        >
                                            Смотреть проект
                                            <ArrowRightIcon className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        ) : null}

                        <section
                            id="visit"
                            className="scroll-mt-24 rounded-2xl border border-ink-150 bg-white p-5 md:p-6"
                        >
                            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                                <div>
                                    <div className="eyebrow">
                                        Запись на просмотр
                                    </div>
                                    <h2 className="mt-1 font-display text-h2">
                                        {obj.status === "built"
                                            ? "Посмотреть готовый дом"
                                            : "Приехать на стройплощадку"}
                                    </h2>
                                    <p className="mt-2 text-[14px] text-ink-500">
                                        {obj.status === "built"
                                            ? "Покажем внутри и снаружи, разберём узлы, ответим по срокам и смете."
                                            : "Увидите текущий этап, познакомитесь с прорабом, оцените качество «вживую»."}
                                    </p>
                                    <div className="mt-4 space-y-2 text-[13px]">
                                        <TrustRow text="Слот ~1 час" />
                                        <TrustRow text="Ближайшее — завтра" />
                                        <TrustRow text="Согласие на показ получено" />
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <a
                                            href={telegramLink(prefill)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-tg btn-sm"
                                        >
                                            <TelegramIcon className="h-4 w-4" />{" "}
                                            Telegram
                                        </a>
                                        <a
                                            href={whatsappLink(prefill)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-wa btn-sm"
                                        >
                                            <WhatsappIcon className="h-4 w-4" />{" "}
                                            WhatsApp
                                        </a>
                                        <a
                                            href={`tel:${settings.phoneClean}`}
                                            className="btn btn-light btn-sm"
                                        >
                                            <PhoneIcon className="h-4 w-4" />{" "}
                                            {settings.phone}
                                        </a>
                                    </div>
                                </div>
                                <LeadForm
                                    source="built-object-visit"
                                    prefill={`Запись: ${obj.displayTitle}`}
                                    ctaLabel="Записаться"
                                    withDate
                                />
                            </div>
                        </section>

                        {obj.hasReview ? (
                            <section className="rounded-2xl border border-ink-150 bg-ink-950 p-5 text-white md:p-6">
                                <div className="flex items-center gap-1 text-accent-onDark">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <StarIcon key={i} className="h-4 w-4" />
                                    ))}
                                </div>
                                <p className="mt-3 text-[15px] leading-relaxed text-white/90">
                                    «{obj.reviewQuote}»
                                </p>
                                <div className="mt-4 text-[13px] text-white/55">
                                    {obj.reviewAuthor}
                                    {obj.status === "built"
                                        ? " · дом сдан"
                                        : " · объект в работе"}
                                </div>
                            </section>
                        ) : null}
                    </div>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="space-y-4">
                            {baseProject ? (
                                <div className="rounded-2xl border border-accent/25 bg-accent-soft/30 p-4">
                                    <div className="eyebrow text-accent">
                                        По проекту
                                    </div>
                                    <div className="mt-1 font-display text-lg font-extrabold text-ink-950">
                                        {baseProject.displayName}
                                    </div>
                                    <p className="mt-0.5 text-[12px] text-ink-600">
                                        {baseProject.subtitle}
                                    </p>
                                    <div className="mt-1.5 text-[13px] font-semibold text-ink-900">
                                        от {formatPrice(baseProject.priceFrom)}
                                    </div>
                                    <Link
                                        href={`/projects/${baseProject.slug}`}
                                        className="btn btn-primary btn-lg mt-3 w-full"
                                    >
                                        Хочу такой же
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </Link>
                                </div>
                            ) : null}

                            <div className="rounded-2xl border border-ink-150 bg-white p-5 shadow-card">
                                <div className="font-display text-[15px] font-extrabold">
                                    Записаться на просмотр
                                </div>
                                <p className="mt-1 text-[12px] text-ink-500">
                                    Ответим за 15 минут · {obj.foreman}
                                </p>
                                {obj.showPrice && obj.price ? (
                                    <div className="mt-3 rounded-lg bg-ink-50 px-3 py-2">
                                        <div className="text-[10px] uppercase tracking-wider text-ink-500">
                                            Стоимость объекта
                                        </div>
                                        <div className="font-display text-xl font-extrabold">
                                            {formatPrice(obj.price)}
                                        </div>
                                    </div>
                                ) : null}
                                <div className="mt-4 space-y-2">
                                    <a
                                        href="#visit"
                                        className="btn btn-dark w-full"
                                    >
                                        Форма записи
                                    </a>
                                    <a
                                        href={telegramLink(prefill)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-tg w-full"
                                    >
                                        <TelegramIcon className="h-4 w-4" />{" "}
                                        Telegram
                                    </a>
                                    <a
                                        href={whatsappLink(prefill)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-wa w-full"
                                    >
                                        <WhatsappIcon className="h-4 w-4" />{" "}
                                        WhatsApp
                                    </a>
                                    <a
                                        href={`tel:${settings.phoneClean}`}
                                        className="btn btn-light w-full"
                                    >
                                        <PhoneIcon className="h-4 w-4" />{" "}
                                        {settings.phone}
                                    </a>
                                </div>
                                <div className="mt-4 space-y-1.5 border-t border-ink-150 pt-3 text-[12px] text-ink-600">
                                    <TrustRow
                                        text={`${obj.gallery.length} фото в хронике`}
                                    />
                                    <TrustRow
                                        text={`бригада ${obj.crewSize} чел.`}
                                    />
                                    <TrustRow
                                        text={`гарантия ${settings.warrantyYears} лет`}
                                    />
                                </div>
                            </div>

                            {obj.status === "in-progress" ? (
                                <div className="rounded-2xl border border-ink-150 bg-ink-950 p-5 text-white">
                                    <div className="flex items-center gap-2 text-[13px] font-semibold">
                                        <CameraIcon className="h-4 w-4 text-accent-onDark" />
                                        Онлайн-камера
                                    </div>
                                    <p className="mt-2 text-[12px] text-white/65">
                                        24/7 на площадке. Доступ после договора
                                        (в превью — заглушка).
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-ink-150 bg-white p-5">
                                    <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-950">
                                        <ShieldIcon className="h-4 w-4 text-success" />
                                        Гарантия {settings.warrantyYears} лет
                                    </div>
                                    <p className="mt-2 text-[12px] text-ink-500">
                                        По договору · прораб на связи после
                                        сдачи
                                    </p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {otherObjects.length > 0 ? (
                    <section className="mt-10">
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <div className="eyebrow">Ещё объекты</div>
                                <h2 className="mt-1 font-display text-h2">
                                    Другие дома из портфолио
                                </h2>
                            </div>
                            <Link
                                href="/works"
                                className="text-sm font-semibold text-ink-950 hover:text-accent"
                            >
                                Все →
                            </Link>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {otherObjects.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-150 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-sticky backdrop-blur lg:hidden">
                <div className="flex items-center gap-2">
                    {baseProject ? (
                        <Link
                            href={`/projects/${baseProject.slug}`}
                            className="btn btn-primary h-11 flex-1 text-[13px]"
                        >
                            Хочу такой дом
                        </Link>
                    ) : (
                        <a
                            href="#visit"
                            className="btn btn-primary h-11 flex-1 text-[13px]"
                        >
                            Записаться
                        </a>
                    )}
                    <a
                        href={telegramLink(prefill)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-tg btn-icon h-11 w-11 flex-shrink-0"
                        aria-label="Telegram"
                    >
                        <TelegramIcon className="h-4 w-4" />
                    </a>
                    <a
                        href={`tel:${settings.phoneClean}`}
                        className="btn btn-light btn-icon h-11 w-11 flex-shrink-0"
                        aria-label="Позвонить"
                    >
                        <PhoneIcon className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </main>
    );
}

function Stat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-ink-150 bg-ink-50/50 p-3">
            <div className="text-ink-500">{icon}</div>
            <div className="mt-1.5 text-[10px] uppercase tracking-wider text-ink-500">
                {label}
            </div>
            <div className="mt-0.5 font-display text-[15px] font-extrabold text-ink-950">
                {value}
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4 border-b border-ink-150 py-2.5 text-[14px]">
            <span className="text-ink-500">{label}</span>
            <span className="text-right font-semibold text-ink-950">{value}</span>
        </div>
    );
}

function TrustRow({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-success" />
            <span>{text}</span>
        </div>
    );
}
