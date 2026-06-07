import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PHONES } from "@/content/contacts";
import { SERVICE_MAP, SERVICES, type ServiceSlug } from "../services";
import { ServiceCtaLink } from "./ServiceCtaLink";
import styles from "./detail.module.css";
import { SERVICE_SEO_CONTENT, type ServiceFaqItem } from "./seoContent";

interface Props {
    params: Promise<{ slug: string }>;
}

type QuickFact =
    | string
    | {
          label?: string;
          value?: string;
          title?: string;
          text?: string;
          description?: string;
      };

type ServiceImage =
    | string
    | {
          src: string;
          alt?: string;
      };

interface DetailVariant {
    title: string;
    description: string;
}

type DetailIconName =
    | "site"
    | "document"
    | "layers"
    | "measure"
    | "route"
    | "shield"
    | "clock"
    | "case"
    | "materials"
    | "engineering"
    | "home"
    | "leaf";

type DetailService = (typeof SERVICES)[number] & {
    fitFor?: string[];
    includes?: string[];
    notIncluded?: string[];
    priceFactors?: string[];
    deliverables?: string[];
    quickFacts?: QuickFact[];
    relatedSlugs?: ServiceSlug[];
    image?: ServiceImage;
    detailPain?: string;
    detailPromise?: string;
    detailVariants?: DetailVariant[];
    detailChecks?: string[];
    detailNextStep?: string;
    detailCta?: string;
};

const DEFAULT_IMAGE = "/images/projects/berg.jpg";
const DEFAULT_QUICK_FACT_LABELS = ["Старт", "Расчёт", "Фиксация"];
const CONTACT_REQUEST_HREF = "/contacts#request";
const QUICK_FACT_ICONS: DetailIconName[] = ["site", "document", "route"];
const FORMAT_ICONS: DetailIconName[] = ["layers", "measure", "home"];
const SCOPE_ICONS: DetailIconName[] = ["site", "document", "shield", "case"];
const VISUAL_POINT_ICONS: DetailIconName[] = [
    "measure",
    "engineering",
    "materials",
];
const QUICK_FACT_LABELS: Record<ServiceSlug, string[]> = {
    design: ["Участок", "Проект", "Проверка"],
    construction: ["Проект", "Смета", "Этапы"],
    foundations: ["Грунт", "Этап", "Бюджет"],
    baths: ["Влажность", "Вентиляция", "Очередь"],
    commercial: ["Поток", "Запуск", "Мощности"],
    finishing: ["База", "Материалы", "Инженерия"],
    landscaping: ["План", "Вода", "Посадки"],
    engineering: ["Схема", "Проверка", "Оборудование"],
    demolition: ["Риски", "Подготовка", "Вывоз"],
};
const SUPPORTING_IMAGES: Record<ServiceSlug, { src: string; alt: string }> = {
    design: {
        src: "/images/projects/nord.jpg",
        alt: "Архитектурный проект современного дома",
    },
    construction: {
        src: "/images/projects/berg.jpg",
        alt: "Фасад загородного дома в процессе комплектации",
    },
    foundations: {
        src: "/images/projects/eliot.jpg",
        alt: "Загородный дом с подготовленным основанием",
    },
    baths: {
        src: "/images/projects/otto.jpg",
        alt: "Банный комплекс на загородном участке",
    },
    commercial: {
        src: "/images/projects/alaster.jpg",
        alt: "Коммерческий объект в загородной архитектуре",
    },
    finishing: {
        src: "/images/projects/faust.jpg",
        alt: "Дом с готовым фасадом и отделочными решениями",
    },
    landscaping: {
        src: "/images/projects/karl.jpg",
        alt: "Благоустроенный участок у загородного дома",
    },
    engineering: {
        src: "/images/projects/valter.jpg",
        alt: "Загородный дом с инженерной подготовкой",
    },
    demolition: {
        src: "/images/projects/berg.jpg",
        alt: "Участок для подготовки к новым работам",
    },
};

function ServiceDetailIcon({
    name,
    className,
}: {
    name: DetailIconName;
    className?: string;
}) {
    const iconClassName = className
        ? `${styles.detailIcon} ${className}`
        : styles.detailIcon;

    return (
        <span className={iconClassName} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
                {name === "site" && (
                    <>
                        <path d="M4 19.5V8.7L12 4l8 4.7v10.8" />
                        <path d="M8 19.5v-7h8v7" />
                        <path d="M9.5 8.8h5" />
                    </>
                )}
                {name === "document" && (
                    <>
                        <path d="M7 3.8h7.2L18 7.6v12.6H7z" />
                        <path d="M14 3.8v4h4" />
                        <path d="M9.8 12h4.8" />
                        <path d="M9.8 15.3h3.5" />
                    </>
                )}
                {name === "layers" && (
                    <>
                        <path d="m12 4 8 4.4-8 4.4-8-4.4z" />
                        <path d="m5.8 12 6.2 3.4 6.2-3.4" />
                        <path d="m5.8 15.8 6.2 3.4 6.2-3.4" />
                    </>
                )}
                {name === "measure" && (
                    <>
                        <path d="M5 17.5 17.5 5 20 7.5 7.5 20 5 17.5z" />
                        <path d="m13.5 7.8 2.7 2.7" />
                        <path d="m10.6 10.7 2.2 2.2" />
                        <path d="m7.7 13.6 2.7 2.7" />
                    </>
                )}
                {name === "route" && (
                    <>
                        <path d="M6.5 6.5h4.2a3 3 0 0 1 0 6H9.3a3 3 0 0 0 0 6H18" />
                        <path d="M6.5 8.8a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z" />
                        <path d="M18 20.8a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z" />
                    </>
                )}
                {name === "shield" && (
                    <>
                        <path d="M12 3.8 19 6v5.4c0 4.1-2.6 7.7-7 9.2-4.4-1.5-7-5.1-7-9.2V6z" />
                        <path d="m8.8 12.2 2.1 2.1 4.6-5" />
                    </>
                )}
                {name === "clock" && (
                    <>
                        <path d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z" />
                        <path d="M12 7.5v5l3.3 2" />
                    </>
                )}
                {name === "case" && (
                    <>
                        <path d="M5 8h14v11H5z" />
                        <path d="M9 8V5.5h6V8" />
                        <path d="M5 12.5h14" />
                        <path d="M10.2 12.5v1.7h3.6v-1.7" />
                    </>
                )}
                {name === "materials" && (
                    <>
                        <path d="M4.5 16.5 12 20l7.5-3.5" />
                        <path d="M4.5 12 12 15.5 19.5 12" />
                        <path d="M4.5 7.5 12 4l7.5 3.5-7.5 3.5z" />
                    </>
                )}
                {name === "engineering" && (
                    <>
                        <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z" />
                        <path d="m12 3.6.9 2.2 2.4.6 2-1.2 1.5 1.5-1.2 2 .6 2.4 2.2.9v2l-2.2.9-.6 2.4 1.2 2-1.5 1.5-2-1.2-2.4.6-.9 2.2h-2l-.9-2.2-2.4-.6-2 1.2-1.5-1.5 1.2-2-.6-2.4-2.2-.9v-2l2.2-.9.6-2.4-1.2-2 1.5-1.5 2 1.2 2.4-.6.9-2.2z" />
                    </>
                )}
                {name === "home" && (
                    <>
                        <path d="M4.2 11.2 12 4.5l7.8 6.7" />
                        <path d="M6.5 10v10h11V10" />
                        <path d="M10 20v-5.5h4V20" />
                    </>
                )}
                {name === "leaf" && (
                    <>
                        <path d="M5 19c8.8 0 14-5.6 14-14-8.4 0-14 5.2-14 14z" />
                        <path d="M5 19c2.8-4.7 6.2-7.6 10.6-9.7" />
                    </>
                )}
            </svg>
        </span>
    );
}

function compactList(items: string[]) {
    return items.filter((item) => item.trim().length > 0);
}

function getList(items: string[] | undefined, fallback: string[]) {
    const list = compactList(items ?? []);

    return list.length > 0 ? list : compactList(fallback);
}

function getQuickFacts(service: DetailService) {
    const labels = QUICK_FACT_LABELS[service.slug] ?? DEFAULT_QUICK_FACT_LABELS;
    const facts: QuickFact[] =
        service.quickFacts && service.quickFacts.length > 0
            ? service.quickFacts
            : service.highlights.slice(0, 3).map((value, index) => ({
                  label: labels[index] ?? "Факт",
                  value,
              }));

    return facts
        .map((fact, index) => {
            if (typeof fact === "string") {
                return {
                    label: labels[index] ?? "Факт",
                    value: fact,
                };
            }

            return {
                label: fact.label ?? fact.title ?? labels[index] ?? "Факт",
                value: fact.value ?? fact.text ?? fact.description ?? "",
            };
        })
        .filter((fact) => fact.value.trim().length > 0)
        .slice(0, 3);
}

function getServiceImage(service: DetailService) {
    const image = service.image as ServiceImage | undefined;

    if (typeof image === "string" && image.trim().length > 0) {
        return { src: image, alt: service.title };
    }

    if (
        typeof image === "object" &&
        image?.src &&
        image.src.trim().length > 0
    ) {
        return {
            src: image.src,
            alt: image.alt ?? service.title,
        };
    }

    return { src: DEFAULT_IMAGE, alt: service.title };
}

function getSupportingImage(service: DetailService) {
    return SUPPORTING_IMAGES[service.slug];
}

function getEntryFormats(service: DetailService) {
    if (service.detailVariants && service.detailVariants.length > 0) {
        return service.detailVariants.slice(0, 3);
    }

    return service.highlights.slice(0, 3).map((item) => ({
        title: item,
        description:
            "Покажем, как этот пункт влияет на состав работ, сроки и смету до запуска.",
    }));
}

function getRelatedServices(service: DetailService) {
    const relatedBySlug = service.relatedSlugs?.reduce<DetailService[]>(
        (items, relatedSlug) => {
            const relatedService = SERVICE_MAP.get(relatedSlug) as
                | DetailService
                | undefined;

            if (
                !relatedService ||
                relatedService.slug === service.slug ||
                items.some((item) => item.slug === relatedService.slug)
            ) {
                return items;
            }

            return [...items, relatedService];
        },
        []
    );

    if (relatedBySlug && relatedBySlug.length > 0) {
        return relatedBySlug.slice(0, 3);
    }

    return SERVICES.filter((item) => item.slug !== service.slug).slice(
        0,
        3
    ) as DetailService[];
}

function getFaqJsonLd(service: DetailService, faq: ServiceFaqItem[]) {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
        about: {
            "@type": "Service",
            name: service.shortTitle,
            description: service.description,
        },
    }).replace(/</g, "\\u003c");
}

export function generateStaticParams() {
    return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = SERVICE_MAP.get(slug as ServiceSlug);

    if (!service) return { title: "Услуга не найдена" };

    return {
        title: `${service.shortTitle} — услуги | Новый Коттедж`,
        description: service.description,
        alternates: { canonical: `/services/${service.slug}` },
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const { slug } = await params;
    const service = SERVICE_MAP.get(slug as ServiceSlug) as
        | DetailService
        | undefined;

    if (!service) notFound();

    const quickFacts = getQuickFacts(service);
    const heroImage = getServiceImage(service);
    const supportingImage = getSupportingImage(service);
    const entryFormats = getEntryFormats(service);
    const fitFor = getList(service.fitFor, [
        `нужен понятный план по направлению «${service.shortTitle.toLowerCase()}»`,
        "важно заранее увидеть состав работ, ограничения и бюджет",
        "хотите получить решение под участок, сроки и сценарий эксплуатации",
    ]);
    const includes = getList(service.includes, service.scopes);
    const notIncluded = getList(service.notIncluded, [
        "работы и материалы, которые не зафиксированы в смете",
        "дополнительные обследования и согласования вне утверждённого ТЗ",
        "изменения проекта или комплектации после согласования без пересчёта",
    ]);
    const priceFactors = getList(service.priceFactors, [
        "объём работ, площадь и сложность объекта",
        "исходное состояние участка, дома или существующих конструкций",
        "выбранные материалы, технологии и комплектация",
        "сроки, сезонность, логистика и доступность объекта",
    ]);
    const deliverables = getList(service.deliverables, [
        "согласованный состав работ с понятными границами ответственности",
        "сметный ориентир, этапы и следующий шаг по запуску",
        "результат, зафиксированный в договоре, актах или рабочей документации",
    ]);
    const detailPain = service.detailPain ?? service.summary;
    const detailPromise = service.detailPromise ?? service.lead;
    const detailChecks = getList(service.detailChecks, priceFactors).slice(
        0,
        4
    );
    const visualPoints = detailChecks.slice(0, 3);
    const detailNextStep =
        service.detailNextStep ??
        "Уточнить вводные, ограничения и формат результата перед расчётом.";
    const nextStepItems = [
        "исходные данные объекта",
        "задачи, сроки и бюджет",
        "формат проекта или работ",
    ];
    const primaryCta = "Получить предварительный расчёт";
    const compactCta = "Получить расчёт";
    const engineerCta = "Обсудить с инженером";
    const seoContent = SERVICE_SEO_CONTENT[service.slug];
    const faqJsonLd = getFaqJsonLd(service, seoContent.faq);
    const related = getRelatedServices(service);

    return (
        <section className={styles.page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: faqJsonLd }}
            />
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Услуги", href: "/services" },
                        { label: service.shortTitle },
                    ]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <p className={styles.eyebrow}>{service.eyebrow}</p>
                        <h1>{service.title}</h1>
                        <p className={styles.lead}>{service.lead}</p>

                        <div className={styles.heroActions}>
                            <ServiceCtaLink
                                className={styles.primaryButton}
                                href={CONTACT_REQUEST_HREF}
                                serviceSlug={service.slug}
                                serviceTitle={service.shortTitle}
                                action="request"
                                placement="hero"
                            >
                                {primaryCta}
                            </ServiceCtaLink>
                            <ServiceCtaLink
                                className={styles.secondaryButton}
                                href={`tel:${PHONES.spb.number}`}
                                serviceSlug={service.slug}
                                serviceTitle={service.shortTitle}
                                action="call"
                                placement="hero"
                            >
                                {engineerCta}
                            </ServiceCtaLink>
                        </div>

                        <dl className={styles.quickFacts}>
                            {quickFacts.map((fact, index) => (
                                <div key={`${fact.label}-${fact.value}`}>
                                    <ServiceDetailIcon
                                        name={
                                            QUICK_FACT_ICONS[index] ??
                                            "document"
                                        }
                                        className={styles.factIcon}
                                    />
                                    <dt>{fact.label}</dt>
                                    <dd>{fact.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <aside className={styles.heroVisual}>
                        <Image
                            src={heroImage.src}
                            alt={heroImage.alt}
                            fill
                            priority
                            sizes="(max-width: 1100px) 100vw, 48vw"
                            className={styles.heroImage}
                        />
                        <div className={styles.heroNote}>
                            <span>До расчёта фиксируем</span>
                            <p>{detailPain}</p>
                        </div>
                    </aside>
                </section>

                <section className={styles.promiseSection}>
                    <article className={styles.promiseCard}>
                        <p className={styles.eyebrow}>Инженерный разбор</p>
                        <h2>Считаем объект как систему, а не набор работ</h2>
                        <p>{detailPromise}</p>
                    </article>
                    <article className={styles.nextStepCard}>
                        <div className={styles.nextStepHead}>
                            <ServiceDetailIcon
                                name="document"
                                className={styles.nextStepIcon}
                            />
                            <span className={styles.nextStepLabel}>
                                Первая встреча
                            </span>
                        </div>
                        <h3>Соберём вводные и предложим маршрут</h3>
                        <p>{detailNextStep}</p>
                        <ul className={styles.nextStepList}>
                            {nextStepItems.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <ServiceCtaLink
                            href={CONTACT_REQUEST_HREF}
                            serviceSlug={service.slug}
                            serviceTitle={service.shortTitle}
                            action="request"
                            placement="next-step"
                        >
                            {compactCta}
                        </ServiceCtaLink>
                    </article>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.eyebrow}>Формат работ</p>
                        <h2>Три формата работы</h2>
                        <p>
                            Подбираем масштаб участия под объект: от отдельного
                            этапа до полного цикла с управлением подрядчиками и
                            приёмкой результата.
                        </p>
                    </div>
                    <div className={styles.formatGrid}>
                        {entryFormats.map((variant, index) => (
                            <article
                                key={variant.title}
                                className={styles.formatCard}
                            >
                                <div className={styles.formatCardTop}>
                                    <ServiceDetailIcon
                                        name={FORMAT_ICONS[index] ?? "layers"}
                                        className={styles.cardIcon}
                                    />
                                    <span className={styles.formatNumber}>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <h3>{variant.title}</h3>
                                <p>{variant.description}</p>
                            </article>
                        ))}
                    </div>
                    <div className={styles.visualSection}>
                        <figure className={styles.visualCard}>
                            <Image
                                src={supportingImage.src}
                                alt={supportingImage.alt}
                                fill
                                sizes="(max-width: 1100px) 100vw, 48vw"
                                className={styles.visualImage}
                            />
                            <figcaption>
                                <ServiceDetailIcon
                                    name="shield"
                                    className={styles.visualIcon}
                                />
                                <span className={styles.visualLabel}>
                                    Проверяем на объекте
                                </span>
                                <p>
                                    Сверяем красивые решения с участком,
                                    конструктивом, инженерией и бюджетом до
                                    старта работ.
                                </p>
                            </figcaption>
                        </figure>
                        <div className={styles.visualPoints}>
                            {visualPoints.map((item, index) => (
                                <article key={item}>
                                    <ServiceDetailIcon
                                        name={
                                            VISUAL_POINT_ICONS[index] ??
                                            "measure"
                                        }
                                        className={styles.pointIcon}
                                    />
                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <p>{item}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.eyebrow}>Состав и границы</p>
                        <h2>Фиксируем границы до старта</h2>
                    </div>
                    <div className={styles.scopeGrid}>
                        <article className={styles.listCard}>
                            <div className={styles.listCardHeader}>
                                <ServiceDetailIcon
                                    name={SCOPE_ICONS[0]}
                                    className={styles.cardIcon}
                                />
                                <h3>Подходит, если</h3>
                            </div>
                            <ul>
                                {fitFor.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                        <article className={styles.listCard}>
                            <div className={styles.listCardHeader}>
                                <ServiceDetailIcon
                                    name={SCOPE_ICONS[1]}
                                    className={styles.cardIcon}
                                />
                                <h3>Что входит</h3>
                            </div>
                            <ul>
                                {includes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                        <article
                            className={`${styles.listCard} ${styles.mutedCard}`}
                        >
                            <div className={styles.listCardHeader}>
                                <ServiceDetailIcon
                                    name={SCOPE_ICONS[2]}
                                    className={styles.cardIcon}
                                />
                                <h3>Что не входит</h3>
                            </div>
                            <ul>
                                {notIncluded.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                        <article
                            className={`${styles.listCard} ${styles.accentCard}`}
                        >
                            <div className={styles.listCardHeader}>
                                <ServiceDetailIcon
                                    name={SCOPE_ICONS[3]}
                                    className={styles.cardIcon}
                                />
                                <h3>Что остаётся на выходе</h3>
                            </div>
                            <ul>
                                {deliverables.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </section>

                <section className={styles.estimateSection}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.eyebrow}>Расчёт</p>
                        <h2>
                            Смета строится на конструктиве, комплектации и
                            сценарии эксплуатации
                        </h2>
                        <p>{seoContent.priceNote}</p>
                    </div>
                    <div className={styles.estimateGrid}>
                        <article className={styles.checkCard}>
                            <div className={styles.cardHeading}>
                                <ServiceDetailIcon
                                    name="shield"
                                    className={styles.cardIcon}
                                />
                                <h3>Проверим перед расчётом</h3>
                            </div>
                            <ul>
                                {detailChecks.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                        <article className={styles.factorCard}>
                            <div className={styles.cardHeading}>
                                <ServiceDetailIcon
                                    name="measure"
                                    className={styles.cardIcon}
                                />
                                <h3>Что влияет на смету</h3>
                            </div>
                            <ol>
                                {priceFactors.map((item, index) => (
                                    <li key={item}>
                                        <span>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <p>{item}</p>
                                    </li>
                                ))}
                            </ol>
                        </article>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.eyebrow}>Процесс</p>
                        <h2>Спокойный маршрут от вводных до результата</h2>
                        <p>
                            В каждом этапе есть понятная точка контроля:
                            решение, смета, договор, производство работ и
                            передача результата.
                        </p>
                    </div>
                    <ol className={styles.processList}>
                        {service.stages.map((stage, index) => (
                            <li key={stage}>
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <p>{stage}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className={styles.proofSection}>
                    <article className={styles.proofIntro}>
                        <p className={styles.eyebrow}>Контроль</p>
                        <div className={styles.proofTitle}>
                            <ServiceDetailIcon
                                name="shield"
                                className={styles.cardIcon}
                            />
                            <h2>Что держим в фокусе</h2>
                        </div>
                        <ul>
                            {service.advantages.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>
                    <article className={styles.timingCard}>
                        <div className={styles.cardHeading}>
                            <ServiceDetailIcon
                                name="clock"
                                className={styles.cardIcon}
                            />
                            <h3>Ориентир по срокам</h3>
                        </div>
                        <p>{seoContent.timingLead}</p>
                        <ol>
                            {seoContent.timing.map((item) => (
                                <li key={item.label}>
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                    <p>{item.description}</p>
                                </li>
                            ))}
                        </ol>
                    </article>
                    <article className={styles.examplesCard}>
                        <div className={styles.cardHeading}>
                            <ServiceDetailIcon
                                name="case"
                                className={styles.cardIcon}
                            />
                            <h3>Типовые задачи</h3>
                        </div>
                        <p>{seoContent.examplesLead}</p>
                        <div className={styles.examplesList}>
                            {seoContent.examples.slice(0, 2).map((example) => (
                                <section key={example.title}>
                                    <h4>{example.title}</h4>
                                    <p>{example.description}</p>
                                    <strong>{example.result}</strong>
                                </section>
                            ))}
                        </div>
                    </article>
                </section>

                <section className={styles.faqSection}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.eyebrow}>FAQ</p>
                        <h2>
                            Частые вопросы про{" "}
                            {service.shortTitle.toLowerCase()}
                        </h2>
                    </div>
                    <div className={styles.faqList}>
                        {seoContent.faq.map((item) => (
                            <details
                                key={item.question}
                                className={styles.faqItem}
                            >
                                <summary>{item.question}</summary>
                                <p>{item.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <section className={styles.finalCta}>
                    <div>
                        <p className={styles.eyebrow}>Следующий шаг</p>
                        <h2>
                            Начнём с инженерного разбора, а не с универсальной
                            цены
                        </h2>
                        <p>
                            Разберём вводные по направлению «
                            {service.shortTitle.toLowerCase()}», зафиксируем
                            риски, порядок работ и исходные данные для
                            предварительного расчёта.
                        </p>
                    </div>
                    <div className={styles.finalActions}>
                        <ServiceCtaLink
                            className={styles.primaryButton}
                            href={CONTACT_REQUEST_HREF}
                            serviceSlug={service.slug}
                            serviceTitle={service.shortTitle}
                            action="request"
                            placement="final"
                        >
                            {primaryCta}
                        </ServiceCtaLink>
                        <ServiceCtaLink
                            className={styles.secondaryButton}
                            href={`tel:${PHONES.spb.number}`}
                            serviceSlug={service.slug}
                            serviceTitle={service.shortTitle}
                            action="call"
                            placement="final"
                        >
                            {engineerCta}
                        </ServiceCtaLink>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.eyebrow}>Смежные направления</p>
                        <h2>Может понадобиться ещё</h2>
                    </div>
                    <div className={styles.relatedGrid}>
                        {related.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/services/${item.slug}`}
                                className={styles.relatedCard}
                            >
                                <strong>{item.shortTitle}</strong>
                                <span>{item.description}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </Container>
        </section>
    );
}
