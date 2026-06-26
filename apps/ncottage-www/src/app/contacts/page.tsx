import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPage, section, sectionsOf } from "@/data/pages";
import { getContacts, toContactRecords } from "@/data/settings";
import { ContactRequestForm } from "./ContactRequestForm";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("contacts");
    return {
        title: page?.seoTitle,
        description: page?.seoDescription,
    };
}

function getMapUrl(address: string) {
    return `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
}

export default async function ContactsPage() {
    const [contacts, page] = await Promise.all([
        getContacts(),
        getPage("contacts"),
    ]);
    if (!page) notFound();

    const { phones, email, workHours, legal } = toContactRecords(contacts);
    const hero = section(page, "contactsHero");
    const locations = sectionsOf(page, "locationCards");
    const offices = locations[0];
    const productions = locations[1];
    const form = section(page, "leadForm");

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Контакты" },
                    ]}
                />

                {hero && (
                    <>
                        <SectionHeading
                            eyebrow={hero.eyebrow}
                            title={hero.title}
                            titleAccent={hero.titleAccent}
                            lead={hero.lead}
                            align="left"
                            tone="h1"
                            className={styles.heroHead}
                        />

                        <div className={styles.heroGrid}>
                            <div className={styles.contactPanel}>
                                <div className={styles.quickItem}>
                                    <span className={styles.cardKicker}>
                                        Телефоны
                                    </span>
                                    <a
                                        className={styles.primaryLink}
                                        href={`tel:${phones.spb.number}`}
                                    >
                                        {phones.spb.display}
                                    </a>
                                    <a
                                        className={styles.primaryLink}
                                        href={`tel:${phones.msk.number}`}
                                    >
                                        {phones.msk.display}
                                    </a>
                                </div>
                                <div className={styles.quickItem}>
                                    <span className={styles.cardKicker}>
                                        Почта
                                    </span>
                                    <a
                                        className={styles.primaryLink}
                                        href={`mailto:${email}`}
                                    >
                                        {email}
                                    </a>
                                </div>
                                <div className={styles.quickItem}>
                                    <span className={styles.cardKicker}>
                                        График
                                    </span>
                                    <p className={styles.primaryValue}>
                                        {workHours}
                                    </p>
                                    <p className={styles.muted}>
                                        Выходные — по согласованию
                                    </p>
                                </div>
                            </div>

                            <div className={styles.visitCard}>
                                <div
                                    className={styles.visitMap}
                                    aria-hidden="true"
                                >
                                    <span />
                                    <span />
                                    <span />
                                </div>
                                <span className={styles.cardKicker}>
                                    {hero.visitKicker}
                                </span>
                                <p>{hero.visitText}</p>
                                <a
                                    className={styles.ctaLink}
                                    href={hero.visitCtaHref}
                                >
                                    {hero.visitCtaLabel}
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </Container>

            {offices && (
                <section className={styles.section}>
                    <Container>
                        <SectionHeading
                            eyebrow={offices.eyebrow}
                            title={offices.title ?? ""}
                            lead={offices.lead}
                            align="left"
                            className={styles.sectionHead}
                        />

                        <div className={styles.cardsGrid}>
                            {offices.items.map((office) => (
                                <article
                                    className={styles.officeCard}
                                    key={office.title}
                                >
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardKicker}>
                                            {office.city}
                                        </span>
                                        <h2 className={styles.cardTitle}>
                                            {office.title}
                                        </h2>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <p className={styles.address}>
                                            {office.address}
                                        </p>
                                        <a
                                            className={styles.phoneLink}
                                            href={`tel:${office.phoneNumber}`}
                                        >
                                            {office.phoneDisplay}
                                        </a>
                                        <p className={styles.schedule}>
                                            Будние дни с 10 до 19. Выходные по
                                            согласованию.
                                        </p>
                                        <p className={styles.note}>
                                            {office.note}
                                        </p>
                                    </div>
                                    <a
                                        className={styles.mapLink}
                                        href={getMapUrl(office.address)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Смотреть на карте
                                    </a>
                                </article>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {productions && (
                <section className={styles.sectionAlt}>
                    <Container>
                        <SectionHeading
                            eyebrow={productions.eyebrow}
                            title={productions.title ?? ""}
                            lead={productions.lead}
                            align="left"
                            className={styles.sectionHead}
                        />

                        <div className={styles.productionList}>
                            {productions.items.map((production) => (
                                <article
                                    className={styles.productionCard}
                                    key={production.title}
                                >
                                    <div>
                                        <span className={styles.cardKicker}>
                                            Производственная площадка
                                        </span>
                                        <h2 className={styles.cardTitle}>
                                            {production.title}
                                        </h2>
                                    </div>
                                    <p className={styles.address}>
                                        {production.address}
                                    </p>
                                    <p className={styles.note}>
                                        {production.note}
                                    </p>
                                    <div className={styles.cardActions}>
                                        <a
                                            className={styles.phoneLink}
                                            href={`tel:${production.phoneNumber}`}
                                        >
                                            {production.phoneDisplay}
                                        </a>
                                        <a
                                            className={styles.mapLink}
                                            href={getMapUrl(production.address)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Открыть карту
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            <section id="request" className={styles.requestSection}>
                <Container>
                    <div className={styles.requestGrid}>
                        {form && (
                            <ContactRequestForm
                                eyebrow={form.eyebrow ?? "Обратная связь"}
                                title={form.title}
                                lead={form.lead}
                                button={form.button}
                            />
                        )}

                        <aside className={styles.requisitesCard}>
                            <span className={styles.cardKicker}>Реквизиты</span>
                            <h2 className={styles.cardTitle}>
                                ООО «Новый коттедж»
                            </h2>
                            <dl className={styles.requisitesList}>
                                <div>
                                    <dt>ИНН</dt>
                                    <dd>{legal.inn}</dd>
                                </div>
                                <div>
                                    <dt>КПП</dt>
                                    <dd>{legal.kpp}</dd>
                                </div>
                                <div>
                                    <dt>ОГРН</dt>
                                    <dd>{legal.ogrn}</dd>
                                </div>
                                <div>
                                    <dt>Почта</dt>
                                    <dd>
                                        <a href={`mailto:${email}`}>{email}</a>
                                    </dd>
                                </div>
                            </dl>
                            <p className={styles.note}>
                                Полные банковские реквизиты отправим по запросу
                                вместе с договором и сметой.
                            </p>
                        </aside>
                    </div>
                </Container>
            </section>
        </section>
    );
}
