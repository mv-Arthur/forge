import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getAllProjects,
    getObjectsForProject,
    getProject,
    getSimilarProjects,
} from "@/lib/data";
import {
    formatArea,
    formatPurpose,
    formatStyle,
    formatTechnology,
    formatTechnologyBrand,
    projectObjectsHeadline,
    timesWord,
} from "@/lib/format";
import { MaterialSwitcher } from "@/components/MaterialSwitcher";
import { FloorPlansTabs } from "@/components/FloorPlansTabs";
import { HouseNodes } from "@/components/HouseNodes";
import { MediaShowcase } from "@/components/MediaShowcase";
import { MortgageCalc } from "@/components/MortgageCalc";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ProjectHero } from "@/components/ProjectHero";
import { BuiltObjectCard } from "@/components/BuiltObjectCard";
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

    const objects = getObjectsForProject(slug);
    const similar = getSimilarProjects(slug);
    const objectsBuilt = objects.filter((o) => o.status === "built").length;
    const objectsBuilding = objects.filter(
        (o) => o.status === "in-progress",
    ).length;
    const objectsHead = projectObjectsHeadline(objectsBuilt, objectsBuilding);

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
                            hasObjects: objects.length > 0,
                        })}
                    />
                </div>
            </div>

            <div className="border-b border-ink-150 bg-white">
                <div className="container-page py-4 md:py-5">
                    <ProjectSummaryBar project={project} />
                </div>
            </div>

            <div className="container-page pt-6 space-y-10">
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
                        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
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
                        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
                            Состав работ одинаков для всех домов из этого
                            материала — это регламент компании, а не описание
                            конкретного проекта.
                        </p>
                    </div>
                    <HouseNodes
                        wallMaterial={formatTechnology(
                            project.variants[0]?.technology,
                        )}
                        buildTime={project.buildTime}
                    />
                </section>

                <section>
                    <AboutProject project={project} />
                </section>

                <section id="ipoteka">
                    <MortgageCalc initialPrice={project.priceFrom} />
                </section>

                {objects.length > 0 ? (
                    <section id="vzhivuyu">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <div className="eyebrow">Посмотреть вживую</div>
                                <h2 className="mt-1 font-display text-h1">
                                    {objectsHead.title}
                                </h2>
                                <p className="mt-1 text-ink-500">
                                    {objectsHead.lead}
                                </p>
                            </div>
                            <Link
                                href="/works"
                                className="hidden text-sm font-semibold text-ink-950 hover:text-accent md:inline-flex"
                            >
                                Все объекты →
                            </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {objects.slice(0, 4).map((o) => (
                                <BuiltObjectCard
                                    key={o.slug}
                                    object={o}
                                    compact
                                />
                            ))}
                        </div>
                    </section>
                ) : null}

                <section id="otzyvy">
                    <TestimonialSlice projectName={project.displayName} />
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
    const living = project.livingArea ? formatArea(project.livingArea) : null;
    const techList = project.technologies.map(formatTechnologyBrand);
    const style = formatStyle(project.style).toLowerCase();
    const hasTerrace =
        project.hasTerrace || project.features.includes("terrace");
    const built = project.builtCount;

    const family = familyPhrase(project.bedrooms);
    const p1 = [
        `${name} — ${floorsPhrase(project.floors)} в стиле «${style}»${
            size ? `, пятно застройки ${size}` : ""
        }.`,
        area
            ? `Общая площадь ${area}${living ? `, жилая — ${living}` : ""}.`
            : null,
        `${family.charAt(0).toUpperCase()}${family.slice(1)}.`,
    ]
        .filter(Boolean)
        .join(" ");

    const materialLead =
        techList.length === 1
            ? `Строим из ${techMaterialPrep(techList[0])}: в договоре — фиксированная смета и срок${
                  project.buildTime ? ` ${project.buildTime} под ключ` : ""
              }`
            : `Материал стен выбираете вы — ${techList
                  .map((t) => t.toLowerCase())
                  .join(", ")}. Цена и срок пересчитываются сразу, без «уточним на объекте»`;

    const extras: string[] = [];
    if (hasTerrace) extras.push("терраса уже в проекте");
    if (project.ceilingHeight >= 3)
        extras.push(`потолки ${project.ceilingHeight.toFixed(1)} м`);
    if (project.planEditable) extras.push("планировку меняем бесплатно");
    if (built > 0)
        extras.push(
            built === 1
                ? "есть сданный дом по этому проекту — можно посмотреть вживую"
                : `по проекту уже построено ${built} ${timesWord(built)} — есть что показать на объекте`,
        );
    else if (project.buildingCount > 0)
        extras.push(
            "по этому проекту сейчас идёт стройка — можно приехать на площадку",
        );
    if (extras.length === 0)
        extras.push(
            `гарантия ${project.warranty} лет прописана в договоре, не «на словах»`,
        );

    const p2 = `${materialLead}. ${extras[0].charAt(0).toUpperCase()}${extras[0].slice(1)}${
        extras.length > 1 ? "; " + extras.slice(1).join("; ") : ""
    }.`;

    const p3 = `Если ${name} откликается — приезжайте на похожий объект, разберём узлы и посчитаем смету под ваш участок. Менеджер ответит в течение дня и поможет сравнить комплектации.`;

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

/**
 * Заглушка под контент — как блок 3D-тура: dashed, «Здесь будет…», без рендеров.
 */
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

/**
 * «О проекте» — сетка карточек; фото — заглушки (рендеры не подставляем).
 */
function AboutProject({
    project,
}: {
    project: NonNullable<ReturnType<typeof getProject>>;
}) {
    const paragraphs = aboutParagraphs(project);
    const aboutText = paragraphs[0] ?? "";
    const spaceText =
        paragraphs[1] ??
        "Светлые помещения, удобные связи комнат и продуманные зоны для семьи.";
    const planText =
        paragraphs[2] ??
        "Планировку можно адаптировать под ваш сценарий — бесплатно на этапе проекта.";

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
                    </div>
                    <ContentSlot
                        className="mt-auto aspect-[4/3] w-full rounded-none border-x-0 border-b-0"
                        title="Здесь будет фото фасада"
                        hint="Главный ракурс дома для блока «О проекте». Нужна съёмка — в превью показано место под кадр."
                    />
                </article>

                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-1 lg:gap-5">
                    <article className="grid overflow-hidden rounded-2xl border border-ink-150 bg-white sm:grid-cols-2 lg:grid-cols-[1fr_1.1fr]">
                        <ContentSlot
                            className="aspect-[4/3] rounded-none border-0 border-b sm:aspect-auto sm:min-h-[200px] sm:border-b-0 sm:border-r"
                            title="Здесь будет интерьер"
                            hint="Гостиная или второй свет — живой кадр после съёмки, не рендер фасада."
                        />
                        <div className="flex flex-col justify-center p-5 md:p-6">
                            <h3 className="font-display text-h3 text-ink-950">
                                Пространство и свет
                            </h3>
                            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                                {spaceText}
                            </p>
                            <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                                <div>
                                    <dt className="text-ink-500">Потолки</dt>
                                    <dd className="font-semibold text-ink-950">
                                        {project.ceilingHeight.toFixed(1)} м
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-ink-500">Жилая</dt>
                                    <dd className="font-semibold text-ink-950">
                                        {formatArea(project.livingArea)}
                                    </dd>
                                </div>
                                <div className="col-span-2">
                                    <dt className="text-ink-500">Фасад</dt>
                                    <dd className="font-semibold leading-snug text-ink-950">
                                        {project.facadeFinish}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </article>

                    <article className="grid overflow-hidden rounded-2xl border border-ink-150 bg-white sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr]">
                        <div className="flex flex-col justify-center order-2 p-5 md:p-6 sm:order-1">
                            <h3 className="font-display text-h3 text-ink-950">
                                Планировка
                            </h3>
                            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                                {planText}
                            </p>
                            <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                                <div>
                                    <dt className="text-ink-500">Срок</dt>
                                    <dd className="font-semibold text-ink-950">
                                        {project.buildTime}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-ink-500">Гарантия</dt>
                                    <dd className="font-semibold text-ink-950">
                                        {project.warranty} лет
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-ink-500">Проживание</dt>
                                    <dd className="font-semibold text-ink-950">
                                        {formatPurpose(project.livingType)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-ink-500">Стиль</dt>
                                    <dd className="font-semibold text-ink-950">
                                        {formatStyle(project.style)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <ContentSlot
                            className="order-1 aspect-[4/3] rounded-none border-0 border-b sm:order-2 sm:aspect-auto sm:min-h-[200px] sm:border-b-0 sm:border-l"
                            title="Здесь будет план этажа"
                            hint="Чистый план для блока «О проекте» — отдельно от секции планировок."
                        />
                    </article>
                </div>
            </div>
        </div>
    );
}

function TestimonialSlice({ projectName }: { projectName: string }) {
    return (
        <div className="grid gap-6 rounded-2xl border border-ink-150 bg-white p-6 md:p-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
                <div className="eyebrow">Отзыв владельца</div>
                <h3 className="mt-1 font-display text-h2">
                    «В доме уже полтора года — рекомендую»
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-700">
                    «{projectName} строили под ПМЖ. Была важна тёплая зима и
                    прозрачная смета — обе задачи выполнены. Прораб на связи
                    даже сейчас, спустя год после сдачи.»
                </p>
                <div className="mt-4 border-t border-ink-150 pt-3 text-[13px]">
                    <div className="font-semibold text-ink-950">
                        Александр П.
                    </div>
                    <div className="text-ink-500">Сдан в 2024, Ленобласть</div>
                </div>
            </div>
            <div className="rounded-2xl bg-ink-950 p-6 text-white md:p-8">
                <div className="eyebrow text-accent-onDark">Ещё пример</div>
                <h4 className="mt-1 font-display text-h3 text-white">
                    Видео-обзор дома от владельца
                </h4>
                <p className="mt-2 text-[13px] text-white/70">
                    Прошли по дому с камерой через год после заселения:
                    какие узлы держатся, что бы сделали иначе.
                </p>
                <div className="mt-4 grid aspect-[16/9] place-items-center rounded-xl bg-white/5 text-white/40">
                    <div className="text-center">
                        <CameraIcon className="mx-auto h-8 w-8" />
                        <div className="mt-2 text-[12px]">Видео-обзор · 4:32</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProjectFaq({
    project,
}: {
    project: NonNullable<ReturnType<typeof getProject>>;
}) {
    const items = [
        {
            q: `Что если я хочу изменить планировку ${project.displayName}?`,
            a: "В пределах несущих стен — бесплатно. Кухню объединить с гостиной, добавить второй свет, поменять расположение санузлов — всё на этапе проекта, до старта работ.",
        },
        {
            q: "Можно ли построить этот дом «зеркально»?",
            a: "Да, зеркальное отражение доступно. Полезно, если участок диктует другую ориентацию входа и окон по солнцу.",
        },
        {
            q: "Что входит в цену «под ключ от»?",
            a: `Указана цена по «Базовой» комплектации в самом бюджетном материале (${formatTechnologyBrand(project.variants[0]?.technology)}). Переключите материал и пакет — увидите точную сумму со всей отделкой.`,
        },
        {
            q: "Как долго строится?",
            a: `Полный цикл — ${project.buildTime}. От подписания договора до передачи ключей. По каждому этапу — фотоотчёт и акт сдачи-приёмки.`,
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
                                {/* SVG, не glyph: rotate «+» съезжает из-за метрик шрифта */}
                                <svg
                                    viewBox="0 0 16 16"
                                    className="absolute h-3.5 w-3.5 transition-opacity group-open:opacity-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                >
                                    <path d="M8 3v10M3 8h10" />
                                </svg>
                                <svg
                                    viewBox="0 0 16 16"
                                    className="absolute h-3.5 w-3.5 opacity-0 transition-opacity group-open:opacity-100"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                >
                                    <path d="M4 4l8 8M12 4l-8 8" />
                                </svg>
                            </span>
                        </summary>
                        <p className="border-t border-ink-150 px-5 py-4 text-[14px] leading-relaxed text-ink-500">
                            {item.a}
                        </p>
                    </details>
                ))}
            </div>
        </div>
    );
}


