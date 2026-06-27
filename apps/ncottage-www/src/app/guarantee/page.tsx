import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL, PHONES } from "@/content/contacts";
import { getPage, section, sectionsOf } from "@/data/pages";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([getPage("guarantee"), getSeo()]);
    return buildPageMetadata({
        seo,
        title: page?.seoTitle ?? "",
        description: page?.seoDescription ?? "",
        path: "/guarantee",
    });
}

export default async function GuaranteePage() {
    const page = await getPage("guarantee");
    if (!page) notFound();

    const hero = section(page, "guaranteeHero");
    const lists = sectionsOf(page, "stringList");
    const conditions = lists[0];
    const exclusions = lists[1];
    const cases = section(page, "cardGrid");
    const claim = section(page, "leadForm");
    if (!hero || !conditions || !exclusions || !cases || !claim) notFound();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Гарантия" },
                    ]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <SectionHeading
                            eyebrow={hero.eyebrow}
                            title={hero.title}
                            titleAccent={hero.titleAccent}
                            lead={hero.lead}
                            align="left"
                            tone="h1"
                        />
                        <div className={styles.heroActions}>
                            <a className={styles.cta} href={hero.ctaAnchor}>
                                {hero.ctaText}
                            </a>
                            <Link
                                className={styles.secondaryLink}
                                href={hero.secondaryLinkHref}
                            >
                                {hero.secondaryLinkText}
                            </Link>
                        </div>
                    </div>
                    <aside className={styles.summaryCard}>
                        <span className={styles.summaryNumber}>
                            {hero.summaryNumber}
                        </span>
                        <span className={styles.summaryLabel}>
                            {hero.summaryLabel}
                        </span>
                        <p>{hero.summaryText}</p>
                    </aside>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow={conditions.eyebrow}
                        title={conditions.title ?? ""}
                        lead={conditions.lead}
                        align="left"
                        className={styles.sectionHead}
                    />
                    <ul className={styles.conditionGrid}>
                        {conditions.items.map((condition, index) => (
                            <li
                                key={condition}
                                className={styles.conditionCard}
                            >
                                <span className={styles.cardIndex}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <p>{condition}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.splitSection}>
                    <div>
                        <SectionHeading
                            eyebrow={cases.eyebrow}
                            title={cases.title ?? ""}
                            align="left"
                            className={styles.sectionHead}
                        />
                        <div className={styles.caseList}>
                            {cases.items.map((item) => (
                                <article
                                    key={item.title}
                                    className={styles.caseCard}
                                >
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <aside className={styles.noteCard}>
                        <h2>{exclusions.title}</h2>
                        <p>{exclusions.lead}</p>
                        <ul>
                            {exclusions.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </aside>
                </section>

                <section id="claim" className={styles.claimSection}>
                    <div className={styles.claimInfo}>
                        <SectionHeading
                            eyebrow={claim.eyebrow}
                            title={claim.title}
                            lead={claim.lead}
                            align="left"
                            className={styles.sectionHead}
                        />
                        <dl className={styles.contacts}>
                            <div>
                                <dt>Санкт-Петербург</dt>
                                <dd>
                                    <a href={`tel:${PHONES.spb.number}`}>
                                        {PHONES.spb.display}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>Москва</dt>
                                <dd>
                                    <a href={`tel:${PHONES.msk.number}`}>
                                        {PHONES.msk.display}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>Email</dt>
                                <dd>
                                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <form className={styles.form}>
                        <label>
                            <span>Номер договора</span>
                            <input
                                name="contract"
                                placeholder="Например, НК-2026-001"
                            />
                        </label>
                        <label>
                            <span>Ваше имя</span>
                            <input
                                name="name"
                                placeholder="Как к вам обращаться"
                            />
                        </label>
                        <label>
                            <span>Телефон</span>
                            <input name="phone" placeholder="+7" required />
                        </label>
                        <label>
                            <span>Описание проблемы</span>
                            <textarea
                                name="message"
                                placeholder="Что произошло и когда заметили проблему"
                                rows={5}
                            />
                        </label>
                        <button className={styles.cta} type="submit">
                            {claim.button}
                        </button>
                        <p className={styles.privacy}>
                            Нажимая кнопку, вы соглашаетесь с{" "}
                            <Link href="/privacy">
                                политикой конфиденциальности
                            </Link>
                            .
                        </p>
                    </form>
                </section>
            </Container>
        </section>
    );
}
