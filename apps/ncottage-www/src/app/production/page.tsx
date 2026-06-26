import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPage, section, sectionsOf } from "@/data/pages";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("production");
    return {
        title: page?.seoTitle,
        description: page?.seoDescription,
        alternates: { canonical: "/production" },
    };
}

export default async function ProductionPage() {
    const page = await getPage("production");
    if (!page) notFound();

    const hero = section(page, "productionHero");
    const cards = sectionsOf(page, "cardGrid");
    const features = cards[0];
    const steps = cards[1];
    const standards = section(page, "stringList");

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "О компании", href: "/about" },
                        { label: "Производство" },
                    ]}
                />

                {hero && (
                    <section className={styles.hero}>
                        <SectionHeading
                            eyebrow={hero.eyebrow}
                            title={hero.title}
                            titleAccent={hero.titleAccent}
                            lead={hero.lead}
                            align="left"
                            tone="h1"
                        />
                        <aside className={styles.heroPanel}>
                            <span className={styles.panelEyebrow}>
                                {hero.panelEyebrow}
                            </span>
                            <strong>{hero.panelValue}</strong>
                            <p>{hero.panelDescription}</p>
                        </aside>
                    </section>
                )}

                {features && (
                    <section className={styles.featureGrid}>
                        {features.items.map((item) => (
                            <article
                                key={item.title}
                                className={styles.featureCard}
                            >
                                <h2>{item.title}</h2>
                                <p>{item.text}</p>
                            </article>
                        ))}
                    </section>
                )}
            </Container>

            {steps && (
                <section className={styles.sectionAlt}>
                    <Container>
                        <SectionHeading
                            eyebrow={steps.eyebrow}
                            title={steps.title ?? ""}
                            titleAccent={steps.titleAccent}
                            lead={steps.lead}
                            align="left"
                            className={styles.sectionHead}
                        />
                        <ol className={styles.steps}>
                            {steps.items.map((step, index) => (
                                <li key={step.title} className={styles.step}>
                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <h3>{step.title}</h3>
                                        <p>{step.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </Container>
                </section>
            )}

            {standards && (
                <Container>
                    <section className={styles.qualityBlock}>
                        <SectionHeading
                            eyebrow={standards.eyebrow}
                            title={standards.title ?? ""}
                            titleAccent={standards.titleAccent}
                            lead={standards.lead}
                            align="left"
                        />
                        <div className={styles.standards}>
                            {standards.items.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </section>
                </Container>
            )}
        </section>
    );
}
