import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPage, section } from "@/data/pages";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("about");
    return {
        title: page?.seoTitle,
        description: page?.seoDescription,
        alternates: { canonical: "/about" },
    };
}

export default async function AboutPage() {
    const page = await getPage("about");
    if (!page) notFound();

    const hero = section(page, "aboutHero");
    const facts = section(page, "valueList");
    const principles = section(page, "cardGrid");
    const team = section(page, "team");
    const timeline = section(page, "timeline");
    const cta = section(page, "ctaLinks");

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "О компании" },
                    ]}
                />

                {hero && (
                    <section className={styles.hero}>
                        <div className={styles.heroText}>
                            <span className={styles.eyebrow}>{hero.eyebrow}</span>
                            <h1 className={styles.title}>{hero.title}</h1>
                            <p className={styles.lead}>{hero.lead}</p>
                        </div>
                        <div className={styles.heroCard}>
                            <p>{hero.cardText}</p>
                            <dl className={styles.heroMeta}>
                                {hero.cardMeta.map((meta) => (
                                    <div key={meta.label}>
                                        <dt>{meta.label}</dt>
                                        <dd>{meta.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </section>
                )}

                {facts && (
                    <section
                        className={styles.factsGrid}
                        aria-label="Факты о компании"
                    >
                        {facts.items.map((fact) => (
                            <div key={fact.label} className={styles.factCard}>
                                <strong>{fact.value}</strong>
                                <span>{fact.label}</span>
                            </div>
                        ))}
                    </section>
                )}
            </Container>

            {principles && (
                <section className={styles.sectionAlt}>
                    <Container>
                        <SectionHeading
                            eyebrow={principles.eyebrow}
                            title={principles.title ?? ""}
                            titleAccent={principles.titleAccent}
                            lead={principles.lead}
                            align="left"
                            className={styles.sectionHead}
                        />
                        <div className={styles.principles}>
                            {principles.items.map((item) => (
                                <article
                                    key={item.title}
                                    className={styles.principleCard}
                                >
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {team && (
                <section className={styles.section}>
                    <Container>
                        <SectionHeading
                            eyebrow={team.eyebrow}
                            title={team.title ?? ""}
                            titleAccent={team.titleAccent}
                            lead={team.lead}
                            align="left"
                            className={styles.sectionHead}
                        />
                        <div className={styles.teamGrid}>
                            {team.members.map((person) => (
                                <article
                                    key={person.name}
                                    className={styles.teamCard}
                                >
                                    <div
                                        className={styles.avatar}
                                        aria-hidden="true"
                                    >
                                        {person.name
                                            .split(" ")
                                            .slice(0, 2)
                                            .map((part) => part[0])
                                            .join("")}
                                    </div>
                                    <div>
                                        <h3>{person.name}</h3>
                                        <span>{person.role}</span>
                                        <p>{person.text}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {timeline && (
                <section className={styles.sectionAlt}>
                    <Container>
                        <SectionHeading
                            eyebrow={timeline.eyebrow}
                            title={timeline.title ?? ""}
                            titleAccent={timeline.titleAccent}
                            lead={timeline.lead}
                            align="left"
                            className={styles.sectionHead}
                        />
                        <ol className={styles.timeline}>
                            {timeline.items.map((item) => (
                                <li
                                    key={item.year}
                                    className={styles.timelineItem}
                                >
                                    <time>{item.year}</time>
                                    <p>{item.text}</p>
                                </li>
                            ))}
                        </ol>
                    </Container>
                </section>
            )}

            {cta && (
                <Container>
                    <section className={styles.cta}>
                        <div>
                            <span className={styles.eyebrow}>{cta.eyebrow}</span>
                            <h2>{cta.title}</h2>
                        </div>
                        <div className={styles.ctaLinks}>
                            {cta.links.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </Container>
            )}
        </section>
    );
}
