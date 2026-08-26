import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllObjects, getListedObjects, getObject } from "@/lib/data";
import {
    formatArea,
    formatFloors,
    formatTechnologyBrand,
    photosWord,
} from "@/lib/format";
import { GwdLeadForm } from "@/components/GwdLeadForm";
import { BuiltObjectCard } from "@/components/BuiltObjectCard";
import {
    BathIcon,
    BedIcon,
    MapPinIcon,
    RulerIcon,
    StairsIcon,
} from "@/components/Icons";
import {
    MORE_HOUSES,
    NAV_WORKS,
    OBJECT_GALLERY_HEADING,
    VISIT_HEADING,
    VISIT_LEAD,
} from "@/lib/copy";

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
        title: o ? `${o.displayTitle} · Новый Коттедж` : "Дом не найден",
    };
}

export default async function BuiltObjectPage({ params }: Props) {
    const { slug } = await params;
    const obj = getObject(slug);
    if (!obj) notFound();

    const otherObjects = getListedObjects()
        .filter((o) => o.slug !== obj.slug)
        .sort((a, b) => b.gallery.length - a.gallery.length)
        .slice(0, 3);
    const prefill = `Дом: ${obj.displayTitle}`;
    const hero = obj.heroImage || obj.gallery[0] || null;

    return (
        <main className="pb-16">
            <section
                data-section="object-hero"
                className="relative min-h-[40vh] bg-ink-900 text-paper md:min-h-[48vh]"
            >
                {hero ? (
                    <Image
                        src={hero}
                        alt={obj.displayTitle}
                        fill
                        priority
                        className="object-cover opacity-75"
                        sizes="100vw"
                    />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-900/35 to-transparent" />
                <div className="container-page relative flex min-h-[40vh] flex-col justify-end pb-10 pt-24 md:min-h-[48vh]">
                    <div className="text-xs text-ink-300">
                        <Link href="/works" className="hover:text-paper">
                            {NAV_WORKS}
                        </Link>{" "}
                        · {obj.displayTitle}
                    </div>
                    <div className="mt-3">
                        <span
                            className={`badge ${
                                obj.status === "in-progress"
                                    ? "badge-progress"
                                    : "badge-built"
                            }`}
                        >
                            {obj.status === "in-progress"
                                ? "Строится"
                                : "Построен"}
                        </span>
                    </div>
                    <h1 className="mt-3 max-w-3xl font-display text-display-2 text-paper">
                        {obj.displayTitle}
                    </h1>
                    {obj.locationLabel ? (
                        <p className="mt-2 flex items-center gap-1.5 text-ink-300">
                            <MapPinIcon className="h-4 w-4" />
                            {obj.locationLabel}
                        </p>
                    ) : null}
                </div>
            </section>

            <section
                data-section="object-facts"
                className="border-b border-ink-150 bg-white"
            >
                <div className="container-page py-6 md:py-8">
                    <div className="flex flex-wrap gap-4 md:gap-8">
                        {obj.area != null ? (
                            <Fact
                                icon={<RulerIcon className="h-4 w-4" />}
                                label="Площадь"
                                value={formatArea(obj.area)}
                            />
                        ) : null}
                        {obj.floors ? (
                            <Fact
                                icon={<StairsIcon className="h-4 w-4" />}
                                label="Этажность"
                                value={formatFloors(obj.floors)}
                            />
                        ) : null}
                        {obj.bedrooms != null ? (
                            <Fact
                                icon={<BedIcon className="h-4 w-4" />}
                                label="Спальни"
                                value={String(obj.bedrooms)}
                            />
                        ) : null}
                        {obj.bathrooms != null ? (
                            <Fact
                                icon={<BathIcon className="h-4 w-4" />}
                                label="Санузлы"
                                value={String(obj.bathrooms)}
                            />
                        ) : null}
                        {obj.technology ? (
                            <Fact
                                icon={null}
                                label="Материал"
                                value={formatTechnologyBrand(obj.technology)}
                            />
                        ) : null}
                        {obj.gallery.length > 0 ? (
                            <Fact
                                icon={null}
                                label="Фото"
                                value={`${obj.gallery.length} ${photosWord(obj.gallery.length)}`}
                            />
                        ) : null}
                    </div>
                    {obj.metaDescription ? (
                        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-600 line-clamp-3 md:line-clamp-4">
                            {obj.metaDescription}
                        </p>
                    ) : null}
                </div>
            </section>

            {obj.gallery.length > 0 ? (
                <section
                    data-section="object-gallery"
                    className="border-b border-ink-150 bg-ink-50/40"
                >
                    <div className="container-page py-10 md:py-14">
                        <div className="eyebrow text-accent">Фото</div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            {OBJECT_GALLERY_HEADING}
                        </h2>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {obj.gallery.map((src, i) => (
                                <div
                                    key={src + i}
                                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-100"
                                >
                                    <Image
                                        src={src}
                                        alt={`${obj.displayTitle} — ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width:1024px) 33vw, 100vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <section data-section="object-lead" className="bg-white">
                <div className="container-page grid gap-10 py-12 md:grid-cols-2 md:py-16">
                    <div>
                        <div className="eyebrow text-accent">Показ</div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            {VISIT_HEADING}
                        </h2>
                        <p className="mt-3 text-sm text-ink-500">
                            {VISIT_LEAD}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-ink-150 bg-ink-50/50 p-5 md:p-6">
                        <GwdLeadForm
                            source={`object-${obj.slug}`}
                            prefill={prefill}
                            ctaLabel="Записаться"
                        />
                    </div>
                </div>
            </section>

            {otherObjects.length > 0 ? (
                <section className="border-t border-ink-150 bg-ink-50/40 py-12">
                    <div className="container-page">
                        <div className="eyebrow text-accent">{MORE_HOUSES}</div>
                        <h2 className="mt-2 font-display text-h1">
                            {MORE_HOUSES}
                        </h2>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {otherObjects.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </main>
    );
}

function Fact({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-[7rem]">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink-500">
                {icon}
                {label}
            </div>
            <div className="mt-1 text-base font-semibold text-ink-950">
                {value}
            </div>
        </div>
    );
}
