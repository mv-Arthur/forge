import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getAllProjects,
    getProject,
    getSimilarProjects,
} from "@/lib/data";
import {
    formatArea,
    formatTechnology,
    formatTechnologyBrand,
} from "@/lib/format";
import { MaterialSwitcher } from "@/components/MaterialSwitcher";
import { FloorPlansTabs } from "@/components/FloorPlansTabs";
import { HouseNodes } from "@/components/HouseNodes";
import { MediaShowcase } from "@/components/MediaShowcase";
import { MortgageCalc } from "@/components/MortgageCalc";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ProjectHero } from "@/components/ProjectHero";
import { AnchorTabs } from "@/components/AnchorTabs";
import { ProjectMobileCta } from "@/components/ProjectStickyCta";
import { ProjectSummaryBar } from "@/components/ProjectSummaryBar";
import { ProjectRetainCta } from "@/components/ProjectRetainCta";
import { CameraIcon } from "@/components/Icons";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const project = getProject(slug);
    return {
        title: project
            ? `${project.displayName} · ${project.subtitle} · Новый Коттедж`
            : "Проект не найден",
    };
}

/**
 * Порядок вкладок = порядок секций в DOM (scroll-spy).
 */
function buildTabs(opts: { hasPlans: boolean; hasObjects: boolean }) {
    return [
        { id: "planirovka", label: "Планировка", show: opts.hasPlans },
        { id: "galereya", label: "Галерея", show: true },
        { id: "chto-vhodit", label: "Что входит", show: true },
        { id: "uzly", label: "Дом по узлам", show: true },
        { id: "ipoteka", label: "Ипотека", show: true },
        { id: "vzhivuyu", label: "Вживую", show: opts.hasObjects },
    ].filter((t) => t.show);
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) notFound();

    const similar = getSimilarProjects(slug);

    return (
        <main className="pb-24">
            <ProjectHero project={project} />

            <div
                className="sticky z-30 border-b border-ink-150 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80"
                style={{ top: "var(--site-header-height)" }}
            >
                <div className="container-page">
                    <AnchorTabs
                        tabs={buildTabs({
                            hasPlans: project.floorPlans.length > 0,
                            hasObjects: false,
                        })}
                    />
                </div>
            </div>

            <div className="border-b border-ink-150 bg-white">
                <div className="container-page py-4 md:py-5">
                    <ProjectSummaryBar project={project} />
                </div>
            </div>

            <div className="container-page pt-6 space-y-12 md:space-y-16">
                {project.floorPlans.length > 0 ? (
                    <section id="planirovka">
                        <FloorPlansTabs
                            project={project}
                            plans={project.floorPlans}
                        />
                    </section>
                ) : null}

                <section id="galereya">
                    <div className="mb-6 max-w-2xl">
                        <div className="eyebrow text-accent">Галерея</div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            Съёмка по разделам
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-ink-500">
                            Фасады, интерьеры и узлы. Кадры ещё не отсняты —
                            здесь размечены места под них.
                        </p>
                    </div>
                    <MediaShowcase />
                </section>

                <section id="materialy">
                    <MaterialSwitcher project={project} />
                </section>

                {/* id именно uzly: chto-vhodit уже занят блоком комплектаций
                    внутри MaterialSwitcher, дубль ломал якорную навигацию. */}
                <section id="uzly">
                    <div className="mb-6">
                        <div className="eyebrow text-accent">
                            Что входит в стоимость
                        </div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            Дом по узлам
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
                            Состав работ одинаков для всех домов из этого
                            материала — это регламент компании, а не описание
                            конкретного проекта.
                        </p>
                    </div>
                    <HouseNodes
                        wallMaterial={formatTechnology(
                            project.variants[0]?.technology,
                        )}
                    />
                </section>

                <section>
                    <AboutProject project={project} />
                </section>

                <section id="ipoteka">
                    <MortgageCalc
                        initialPrice={
                            project.priceFrom != null && project.priceFrom > 0
                                ? project.priceFrom
                                : 0
                        }
                    />
                </section>

                <section id="faq">
                    <ProjectFaq project={project} />
                </section>

                <ProjectRetainCta project={project} />

                {similar.length > 0 ? (
                    <section>
                        <div className="mb-2">
                            <div className="eyebrow">Другие проекты</div>
                            <h2 className="mt-1 font-display text-h1">
                                Похожие дома
                            </h2>
                        </div>
                        <ProjectCarousel projects={similar} />
                    </section>
                ) : null}
            </div>

            <ProjectMobileCta project={project} />
        </main>
    );
}

/** Legacy meta-description from SEO pages — not customer copy. */
function isSeoSpam(text: string): boolean {
    return (
        /☎|\+7\s*\(/.test(text) ||
        /Цены на строительство/i.test(text) ||
        /от компании/i.test(text)
    );
}

function floorsPhrase(floors: string | null | undefined): string {
    switch (floors) {
        case "1":
            return "одноэтажный дом";
        case "1.5":
            return "дом с мансардой";
        case "2":
            return "двухэтажный дом";
        case "mansard":
            return "дом с мансардой";
        default:
            return "дом";
    }
}

function familyPhrase(bedrooms: number | null | undefined): string {
    if (!bedrooms) return "для комфортной жизни за городом";
    if (bedrooms <= 2) return "для пары или небольшой семьи";
    if (bedrooms === 3) return "для семьи с детьми";
    return "для большой семьи — с комнатами для всех и запасом по пространству";
}

/**
 * Marketing blurb for the project card. Prefer real editorial copy when it
 * exists; otherwise compose a readable pitch from structured fields (not a
 * dry specs dump — those live in the fact row below).
 */
function aboutParagraphs(
    project: NonNullable<ReturnType<typeof getProject>>,
): string[] {
    const raw = project.description?.trim() ?? "";
    if (raw && !isSeoSpam(raw)) return [raw];

    const name = project.displayName;
    const size = project.dimensions
        ? project.dimensions.replace(/x/gi, "×") + " м"
        : null;
    const area = project.area ? formatArea(project.area) : null;
    const techList = project.technologies.map(formatTechnologyBrand);
    const hasTerrace =
        project.hasTerrace || project.features.includes("terrace");

    const family = familyPhrase(project.bedrooms);
    const p1 = [
        `${name} — ${floorsPhrase(project.floors)}${
            size ? `, пятно застройки ${size}` : ""
        }.`,
        area ? `Общая площадь ${area}.` : null,
        `${family.charAt(0).toUpperCase()}${family.slice(1)}.`,
    ]
        .filter(Boolean)
        .join(" ");

    const materialLead =
        techList.length === 1
            ? `Строим из ${techMaterialPrep(techList[0])}: в договоре — фиксированная смета`
            : techList.length > 1
              ? `Материал стен выбираете вы — ${techList
                    .map((t) => t.toLowerCase())
                    .join(", ")}`
              : "Комплектация и смета фиксируются в договоре";

    const extras: string[] = [];
    if (hasTerrace) extras.push("терраса уже в проекте");
    extras.push(
        `гарантия ${project.warranty} лет прописана в договоре, не «на словах»`,
    );

    const p2 = `${materialLead}. ${extras[0].charAt(0).toUpperCase()}${extras[0].slice(1)}${
        extras.length > 1 ? "; " + extras.slice(1).join("; ") : ""
    }.`;

    const p3 = `Если ${name} откликается — пришлите участок или бюджет: менеджер ответит в течение дня и поможет сравнить комплектации.`;

    return [p1, p2, p3];
}

function techMaterialPrep(brand: string): string {
    switch (brand) {
        case "Каркас":
            return "каркаса";
        case "Газобетон":
            return "газобетона";
        case "Кирпич":
            return "кирпича";
        case "СИП":
            return "СИП-панелей";
        case "Фахверк":
            return "фахверка";
        default:
            return brand.toLowerCase();
    }
}

function ContentSlot({
    title,
    hint,
    className = "",
}: {
    title: string;
    hint: string;
    className?: string;
}) {
    return (
        <div
            className={`grid place-items-center border border-dashed border-line-strong bg-ink-100 p-5 text-center sm:p-6 ${className}`}
        >
            <div className="max-w-sm">
                <CameraIcon className="mx-auto h-9 w-9 text-ink-400" />
                <div className="mt-3 font-display text-[17px] font-bold leading-snug text-ink-950 sm:text-h3">
                    {title}
                </div>
                <p className="mx-auto mt-2 text-[13px] leading-relaxed text-ink-500 sm:text-[14px]">
                    {hint}
                </p>
            </div>
        </div>
    );
}

function AboutProject({
    project,
}: {
    project: NonNullable<ReturnType<typeof getProject>>;
}) {
    const paragraphs = aboutParagraphs(project);
    const aboutText = paragraphs[0] ?? "";
    const spaceText = paragraphs[1] ?? "";
    const planText = paragraphs[2] ?? "";

    const factRows: Array<{ label: string; value: string }> = [];
    if (project.area != null)
        factRows.push({ label: "Площадь", value: formatArea(project.area) });
    if (project.bedrooms != null)
        factRows.push({ label: "Спальни", value: String(project.bedrooms) });
    if (project.bathrooms != null)
        factRows.push({ label: "Санузлы", value: String(project.bathrooms) });
    if (project.floors)
        factRows.push({
            label: "Этажность",
            value: floorsPhrase(project.floors),
        });
    if (project.dimensions)
        factRows.push({
            label: "Габариты",
            value: project.dimensions.replace(/x/gi, "×") + " м",
        });
    factRows.push({
        label: "Гарантия",
        value: `${project.warranty} лет`,
    });

    return (
        <div>
            <div className="mb-5">
                <div className="eyebrow text-accent">Об этом доме</div>
                <h2 className="mt-2 font-display text-h1 text-ink-950">
                    {project.displayName} в деталях
                </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
                <article className="flex flex-col overflow-hidden rounded-2xl border border-ink-150 bg-white lg:col-span-5">
                    <div className="p-5 md:p-6">
                        <h3 className="font-display text-h2 text-ink-950">
                            О проекте
                        </h3>
                        <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
                            {aboutText}
                        </p>
                        {spaceText ? (
                            <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
                                {spaceText}
                            </p>
                        ) : null}
                        {planText ? (
                            <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
                                {planText}
                            </p>
                        ) : null}
                    </div>
                    <ContentSlot
                        className="mt-auto aspect-[4/3] w-full rounded-none border-x-0 border-b-0"
                        title="Здесь будет фото фасада"
                        hint="Главный ракурс дома для блока «О проекте»."
                    />
                </article>

                <article className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6 lg:col-span-7">
                    <h3 className="font-display text-h3 text-ink-950">
                        Параметры из каталога
                    </h3>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-3">
                        {factRows.map((row) => (
                            <div key={row.label}>
                                <dt className="text-ink-500">{row.label}</dt>
                                <dd className="font-semibold text-ink-950">
                                    {row.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </article>
            </div>
        </div>
    );
}

function ProjectFaq({
    project,
}: {
    project: NonNullable<ReturnType<typeof getProject>>;
}) {
    const tech = formatTechnologyBrand(project.variants[0]?.technology);
    const items = [
        {
            q: `Что если я хочу изменить планировку ${project.displayName}?`,
            a: "В пределах несущих стен — обсудим на этапе проекта. Кухню объединить с гостиной, добавить второй свет, поменять расположение санузлов — до старта работ.",
        },
        {
            q: "Можно ли построить этот дом «зеркально»?",
            a: "Да, зеркальное отражение доступно. Полезно, если участок диктует другую ориентацию входа и окон по солнцу.",
        },
        {
            q: "Что входит в цену «под ключ от»?",
            a: tech
                ? `Указана цена по «Базовой» комплектации в материале ${tech}. Переключите материал и пакет — увидите сумму по пакетам из прайса.`
                : "Цена «от» берётся из минимального пакета комплектации в прайсе. Переключите материал и пакет на странице.",
        },
        {
            q: "Работаете ли по семейной ипотеке?",
            a: "Да, аккредитованы в Сбербанке, ВТБ, Альфа-Банке, Газпромбанке, ПСБ. Помогаем собрать документы, подбираем банк с лучшей ставкой.",
        },
    ];
    return (
        <div>
            <div className="mb-6">
                <div className="eyebrow">Вопросы по проекту</div>
                <h2 className="mt-1 font-display text-h1">
                    Частые вопросы про{" "}
                    <span className="text-accent">{project.displayName}</span>
                </h2>
            </div>
            <div className="space-y-3">
                {items.map((item, i) => (
                    <details
                        key={item.q}
                        className="group rounded-xl border border-ink-150 bg-white open:border-ink-900 open:shadow-card"
                        open={i === 0}
                    >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-semibold text-ink-950 marker:content-none [&::-webkit-details-marker]:hidden">
                            <span className="min-w-0 flex-1 leading-snug">
                                {item.q}
                            </span>
                            <span
                                className="relative grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition-colors group-open:border-ink-900 group-open:bg-ink-950 group-open:text-white"
                                aria-hidden
                            >
                                <span className="absolute h-0.5 w-3 bg-current" />
                                <span className="absolute h-3 w-0.5 bg-current transition-transform group-open:scale-y-0" />
                            </span>
                        </summary>
                        <div className="border-t border-ink-150 px-5 py-4 text-[14px] leading-relaxed text-ink-600">
                            {item.a}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}
