import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getContacts, toContactRecords } from "@/data/settings";
import { ContactRequestForm } from "./ContactRequestForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Контакты | Новый Коттедж",
    description:
        "Контакты строительной компании Новый Коттедж: офисы в Санкт-Петербурге и Москве, производство, телефоны, почта и график работы.",
};

function getMapUrl(address: string) {
    return `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
}

export default async function ContactsPage() {
    const contacts = await getContacts();
    const { phones, addresses, email, workHours, legal } =
        toContactRecords(contacts);

    const offices = [
        {
            city: "Санкт-Петербург",
            title: "Офис Санкт-Петербург",
            address: `${addresses.spb}, офис 405`,
            phone: phones.spb,
            note: "Офис расположен в бизнес-центре «Строй дом». Здесь можно выбрать готовый проект дома вместе со специалистом или обсудить индивидуальное проектирование.",
        },
        {
            city: "Москва",
            title: "Офис Москва",
            address: addresses.msk,
            phone: phones.msk,
            note: "Офис расположен в БЦ «Ривер Плаза». Консультант поможет подобрать технологию строительства, комплектацию и следующий шаг по смете.",
        },
    ];

    const productions = [
        {
            title: "Производство домокомплектов",
            address: addresses.lenobl,
            phone: phones.spb,
            note: "В Ленинградской области находится производство по изготовлению домокомплектов. На экскурсию можно записаться через заявку на сайте или по телефону.",
        },
        {
            title: "Деревообрабатывающее производство",
            address: addresses.novobl,
            phone: phones.spb,
            note: "В Новгородской области находится деревообрабатывающее производство. Покажем материалы и этапы подготовки конструкций по предварительной записи.",
        },
    ];

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Контакты" },
                    ]}
                />

                <SectionHeading
                    eyebrow="Наши контакты"
                    title="Встретимся в офисе или на"
                    titleAccent="производстве"
                    lead="Вы можете приехать в один из офисов компании, выбрать проект со специалистом или записаться на экскурсию на производство. По всем вопросам проконсультируем по телефону и почте."
                    align="left"
                    tone="h1"
                    className={styles.heroHead}
                />

                <div className={styles.heroGrid}>
                    <div className={styles.contactPanel}>
                        <div className={styles.quickItem}>
                            <span className={styles.cardKicker}>Телефоны</span>
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
                            <span className={styles.cardKicker}>Почта</span>
                            <a
                                className={styles.primaryLink}
                                href={`mailto:${email}`}
                            >
                                {email}
                            </a>
                        </div>
                        <div className={styles.quickItem}>
                            <span className={styles.cardKicker}>График</span>
                            <p className={styles.primaryValue}>{workHours}</p>
                            <p className={styles.muted}>
                                Выходные — по согласованию
                            </p>
                        </div>
                    </div>

                    <div className={styles.visitCard}>
                        <div className={styles.visitMap} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                        <span className={styles.cardKicker}>
                            Как проходит визит
                        </span>
                        <p>
                            В офисе покажем каталог проектов, расскажем о
                            технологиях и комплектациях. На производстве можно
                            увидеть подготовку домокомплектов и обсудить
                            материалы до старта строительства.
                        </p>
                        <a className={styles.ctaLink} href="#request">
                            Записаться на встречу
                        </a>
                    </div>
                </div>
            </Container>

            <section className={styles.section}>
                <Container>
                    <SectionHeading
                        eyebrow="Офисы"
                        title="Выберите удобный город"
                        lead="Консультации проходят по предварительной записи в будние дни с 10 до 19."
                        align="left"
                        className={styles.sectionHead}
                    />

                    <div className={styles.cardsGrid}>
                        {offices.map((office) => (
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
                                        href={`tel:${office.phone.number}`}
                                    >
                                        {office.phone.display}
                                    </a>
                                    <p className={styles.schedule}>
                                        Будние дни с 10 до 19. Выходные по
                                        согласованию.
                                    </p>
                                    <p className={styles.note}>{office.note}</p>
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

            <section className={styles.sectionAlt}>
                <Container>
                    <SectionHeading
                        eyebrow="Производство"
                        title="Запишитесь на экскурсию"
                        lead="Покажем, где изготавливаются домокомплекты и как готовятся деревянные конструкции для будущего дома."
                        align="left"
                        className={styles.sectionHead}
                    />

                    <div className={styles.productionList}>
                        {productions.map((production) => (
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
                                <p className={styles.note}>{production.note}</p>
                                <div className={styles.cardActions}>
                                    <a
                                        className={styles.phoneLink}
                                        href={`tel:${production.phone.number}`}
                                    >
                                        {production.phone.display}
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

            <section id="request" className={styles.requestSection}>
                <Container>
                    <div className={styles.requestGrid}>
                        <ContactRequestForm />

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
