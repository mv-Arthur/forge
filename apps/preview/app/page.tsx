import Link from "next/link";
import { getCatalogProjects, getListedObjects } from "@/lib/data";
import { settings } from "@/lib/settings";
import {
    BUILT_HOUSES_HEADING,
    COMPANY_OFFER_LEAD,
    LEAD_EYEBROW,
    LEAD_HEADING,
    MATERIALS_LEAD,
    POPULAR_HEADING,
    POPULAR_LEAD,
    SEE_HOUSES,
    TRUST_HOUSES_LABEL,
    WORKS_EYEBROW,
} from "@/lib/copy";
import { formatTechnologyBrand, projectsWord } from "@/lib/format";
import { ProjectCard } from "@/components/ProjectCard";
import { GwdLeadForm } from "@/components/GwdLeadForm";
import { HeroSlider } from "@/components/HeroSlider";
import { ObjectCarousel } from "@/components/ObjectCarousel";
import type { Technology } from "@/lib/types";

export const metadata = {
    title: "Новый Коттедж — дома под ключ в СПб и Ленобласти",
};

const TECHS: Technology[] = [
    "gas_concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
];

export default function HomePage() {
    const all = getCatalogProjects();
    const featured = [...all]
        .filter((p) => p.priceFrom)
        .sort((a, b) => (b.renders.length || 0) - (a.renders.length || 0))
        .slice(0, 7);
    const popular = all.slice(0, 6);
    const objects = getListedObjects();
    const builtCount = objects.filter((o) => o.status === "built").length;
    const techCounts = TECHS.map((t) => ({
        tech: t,
        count: all.filter((p) => p.technologies.includes(t)).length,
    })).filter((row) => row.count > 0);

    return (
        <main className="pb-16 md:pb-0">
            <section data-section="hero">
                <HeroSlider
                    heading="Дома под ключ в Санкт-Петербурге и Ленобласти"
                    lead={COMPANY_OFFER_LEAD}
                    projects={featured}
                />
            </section>

            <section
                data-section="trust"
                className="border-b border-ink-150 bg-white"
            >
                <div className="container-page py-6 md:py-8">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="kpi rounded-2xl border border-ink-100 bg-ink-50/60 px-5 py-6">
                            <div className="kpi-value font-display">
                                с {settings.foundedYear}
                            </div>
                            <div className="kpi-label">года строим дома</div>
                        </div>
                        <div className="kpi rounded-2xl border border-ink-100 bg-ink-50/60 px-5 py-6">
                            <div className="kpi-value font-display">
                                {settings.warrantyYears} лет
                            </div>
                            <div className="kpi-label">гарантия в договоре</div>
                        </div>
                        <div className="kpi rounded-2xl border border-ink-100 bg-ink-50/60 px-5 py-6">
                            <div className="kpi-value font-display">
                                {objects.length}
                            </div>
                            <div className="kpi-label">
                                {TRUST_HOUSES_LABEL}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                data-section="side-banner-slider"
                className="section border-b border-ink-150 bg-gradient-to-b from-ink-50/80 to-white"
            >
                <div className="container-page">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div className="max-w-2xl">
                            <div className="eyebrow text-accent">
                                {WORKS_EYEBROW}
                            </div>
                            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-ink-950">
                                {BUILT_HOUSES_HEADING}
                            </h2>
                            <p className="mt-3 text-base leading-relaxed text-ink-500">
                                {builtCount > 0
                                    ? `${builtCount} построенных в Ленобласти — можно приехать и посмотреть.`
                                    : "Построенные дома в Ленобласти — можно приехать и посмотреть."}
                            </p>
                        </div>
                        <Link href="/works" className="btn btn-light">
                            {SEE_HOUSES}
                        </Link>
                    </div>
                    <ObjectCarousel objects={objects.slice(0, 12)} />
                </div>
            </section>

            <section data-section="popular" className="section bg-ink-50/50">
                <div className="container-page">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div className="max-w-2xl">
                            <div className="eyebrow text-accent">
                                Популярные проекты
                            </div>
                            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-ink-950">
                                {POPULAR_HEADING}
                            </h2>
                            <p className="mt-3 text-base leading-relaxed text-ink-500">
                                {POPULAR_LEAD}
                            </p>
                        </div>
                        <Link href="/projects" className="btn btn-light">
                            Все проекты
                        </Link>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {popular.map((p, i) => (
                            <ProjectCard
                                key={p.slug}
                                project={p}
                                layout="grid"
                                priority={i < 2}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="lead"
                data-section="lead"
                className="section relative overflow-hidden border-t border-ink-150 bg-white"
            >
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-accent-soft/40 to-transparent" />
                <div className="container-page relative grid gap-10 md:grid-cols-2">
                    <div>
                        <div className="eyebrow text-accent">
                            {LEAD_EYEBROW}
                        </div>
                        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-ink-950">
                            {LEAD_HEADING}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-ink-500 md:text-lg">
                            Ответим по проекту, материалам и смете.{" "}
                            {settings.officeHoursLabel}.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
                            <a
                                href={settings.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ink-600 underline-offset-4 transition-colors hover:text-accent hover:underline"
                            >
                                Telegram
                            </a>
                            <a
                                href={settings.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ink-600 underline-offset-4 transition-colors hover:text-accent hover:underline"
                            >
                                WhatsApp
                            </a>
                            <a
                                href={`tel:${settings.phoneClean}`}
                                className="text-ink-950 underline-offset-4 transition-colors hover:text-accent hover:underline"
                            >
                                {settings.phone}
                            </a>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-ink-150 bg-white p-6 shadow-lift md:p-8">
                        <GwdLeadForm source="home-lead" />
                    </div>
                </div>
            </section>

            {techCounts.length > 0 ? (
                <section
                    data-section="tech"
                    className="section border-t border-ink-150 bg-white"
                >
                    <div className="container-page">
                        <div className="eyebrow text-accent">Материалы</div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            Из чего строим
                        </h2>
                        <p className="mt-3 max-w-2xl text-base text-ink-500">
                            {MATERIALS_LEAD}
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {techCounts.map(({ tech, count }) => (
                                <Link
                                    key={tech}
                                    href={`/projects?tech=${tech}`}
                                    className="rounded-2xl border border-ink-150 bg-ink-50/60 px-4 py-4 transition hover:border-accent/40 hover:bg-white hover:shadow-card"
                                >
                                    <div className="font-display text-xl font-semibold text-ink-950">
                                        {formatTechnologyBrand(tech)}
                                    </div>
                                    <div className="mt-1 text-sm text-ink-500">
                                        {count} {projectsWord(count)}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </main>
    );
}
