import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { getCertificates } from "@/data/certificates";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

const checks = [
    {
        title: "Материалы",
        text: "Подтверждаем происхождение и характеристики материалов, которые используются в домокомплектах и строительных узлах.",
    },
    {
        title: "Процессы",
        text: "Фиксируем требования к безопасности труда, экологическому менеджменту и контролю качества на объекте.",
    },
    {
        title: "Подрядчик",
        text: "Показываем документы, которые помогают заказчику оценить надежность компании до подписания договора.",
    },
];

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["certificates"].title,
        description: seo.indexes["certificates"].description,
        path: "/certificates",
    });
}

export default async function CertificatesPage() {
    const certificates = await getCertificates();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Сертификаты" },
                    ]}
                />

                <section className={styles.hero}>
                    <div>
                        <SectionHeading
                            eyebrow="Документы"
                            title="Лицензии и"
                            titleAccent="сертификаты"
                            lead="Документы по добросовестности исполнителя, менеджменту безопасности, экологическим процессам и сертификации строительных материалов."
                            align="left"
                            tone="h1"
                        />
                        <Link className={styles.cta} href="/partners">
                            Смотреть партнёров
                        </Link>
                    </div>
                    <aside className={styles.heroPanel}>
                        <span>Проверка перед договором</span>
                        <strong>{certificates.length}</strong>
                        <p>
                            основных документов по компании, процессам и
                            строительным материалам.
                        </p>
                    </aside>
                </section>

                <section className={styles.checkGrid}>
                    {checks.map((item) => (
                        <article key={item.title} className={styles.checkCard}>
                            <span>{item.title}</span>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Список"
                        title="Документы компании"
                        lead="Покажем актуальные сертификаты в офисе или приложим нужные документы к коммерческому предложению."
                        align="left"
                        className={styles.sectionHead}
                    />
                    {certificates.length === 0 && (
                        <EmptyState
                            title="Документов пока нет"
                            description="Актуальные сертификаты и лицензии покажем в офисе или приложим к коммерческому предложению."
                        />
                    )}
                    <div className={styles.documentsGrid}>
                        {certificates.map((certificate, index) => {
                            const preview = (
                                <div
                                    className={`${styles.documentPreview} ${
                                        certificate.imageUrl
                                            ? styles.documentPreviewImage
                                            : ""
                                    }`}
                                >
                                    {certificate.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element -- произвольный медиа-хост, не LCP
                                        <img
                                            src={certificate.imageUrl}
                                            alt={certificate.title}
                                            className={styles.documentImage}
                                        />
                                    ) : (
                                        <span>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    )}
                                </div>
                            );
                            const body = (
                                <div className={styles.documentBody}>
                                    <h2>{certificate.title}</h2>
                                    <p>
                                        {certificate.fileUrl
                                            ? "Открыть документ →"
                                            : "Документ доступен для проверки перед заключением договора."}
                                    </p>
                                </div>
                            );
                            return certificate.fileUrl ? (
                                <a
                                    key={certificate.slug}
                                    className={styles.documentCard}
                                    href={certificate.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {preview}
                                    {body}
                                </a>
                            ) : (
                                <article
                                    key={certificate.slug}
                                    className={styles.documentCard}
                                >
                                    {preview}
                                    {body}
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className={styles.ctaBlock}>
                    <div>
                        <h2>Нужны оригиналы документов?</h2>
                        <p>
                            Менеджер покажет сертификаты в офисе или приложит
                            актуальные файлы к коммерческому предложению.
                        </p>
                    </div>
                    <Link className={styles.cta} href="/contacts">
                        Запросить документы
                    </Link>
                </section>
            </Container>
        </section>
    );
}
