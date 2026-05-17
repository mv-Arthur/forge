import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./finance.module.css";

interface StatItem {
    value: string;
    label: string;
}

interface CardItem {
    title: string;
    text: string;
}

interface BankItem {
    name: string;
    note: string;
}

interface FinanceLandingProps {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    canonicalPath: string;
    stats: StatItem[];
    conditionsTitle: string;
    conditionsLead: string;
    conditions: CardItem[];
    stepsTitle: string;
    stepsLead: string;
    steps: CardItem[];
    banksTitle: string;
    banksLead: string;
    banks: BankItem[];
    noteTitle: string;
    noteText: string;
    formTitle: string;
    formLead: string;
    formButton: string;
}

export function FinanceLanding({
    eyebrow,
    title,
    titleAccent,
    lead,
    canonicalPath,
    stats,
    conditionsTitle,
    conditionsLead,
    conditions,
    stepsTitle,
    stepsLead,
    steps,
    banksTitle,
    banksLead,
    banks,
    noteTitle,
    noteText,
    formTitle,
    formLead,
    formButton,
}: FinanceLandingProps) {
    return (
        <div className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: title },
                    ]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <SectionHeading
                            eyebrow={eyebrow}
                            title={title}
                            titleAccent={titleAccent}
                            lead={lead}
                            align="left"
                            tone="h1"
                            className={styles.heroHeading}
                        />
                        <div className={styles.heroActions}>
                            <a href="#lead-form" className={styles.primaryLink}>
                                Получить консультацию
                            </a>
                            <Link href="/projects/all" className={styles.secondaryLink}>
                                Выбрать проект
                            </Link>
                        </div>
                    </div>

                    <aside className={styles.summary} aria-label="Кратко">
                        <span className={styles.summaryLabel}>
                            Финансовый маршрут
                        </span>
                        {stats.map((item) => (
                            <div key={item.label} className={styles.stat}>
                                <strong>{item.value}</strong>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </aside>
                </section>

                <section className={styles.route} aria-label="Единый сценарий">
                    <div className={styles.routeIntro}>
                        <span>Единый сценарий</span>
                        <strong>От финансового вопроса — к готовому пакету</strong>
                    </div>
                    <ol className={styles.routeSteps}>
                        <li>
                            <span>01</span>
                            <strong>Консультация</strong>
                            <p>Разбираем бюджет, участок, сроки и доступный способ оплаты.</p>
                        </li>
                        <li>
                            <span>02</span>
                            <strong>Подбор проекта</strong>
                            <p>Выбираем типовой дом или фиксируем индивидуальное ТЗ.</p>
                        </li>
                        <li>
                            <span>03</span>
                            <strong>Пакет документов</strong>
                            <p>Готовим смету, договорные данные и строительную часть для оплаты или банка.</p>
                        </li>
                    </ol>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Условия"
                        title={conditionsTitle}
                        lead={conditionsLead}
                        align="left"
                        className={styles.sectionHead}
                    />
                    <div className={styles.cardsGrid}>
                        {conditions.map((item) => (
                            <article key={item.title} className={styles.card}>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Процесс"
                        title={stepsTitle}
                        lead={stepsLead}
                        align="left"
                        className={styles.sectionHead}
                    />
                    <ol className={styles.steps}>
                        {steps.map((item, index) => (
                            <li key={item.title} className={styles.step}>
                                <span className={styles.stepNumber}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className={styles.banksSection}>
                    <div>
                        <SectionHeading
                            eyebrow="Форматы"
                            title={banksTitle}
                            lead={banksLead}
                            align="left"
                            className={styles.sectionHead}
                        />
                        <div className={styles.note}>
                            <h3>{noteTitle}</h3>
                            <p>{noteText}</p>
                        </div>
                    </div>
                    <div className={styles.bankGrid}>
                        {banks.map((bank) => (
                            <article key={bank.name} className={styles.bankCard}>
                                <span className={styles.bankLogo}>{bank.name}</span>
                                <p>{bank.note}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="lead-form" className={styles.formSection}>
                    <div className={styles.formIntro}>
                        <span className={styles.formEyebrow}>Заявка</span>
                        <h2>{formTitle}</h2>
                        <p>{formLead}</p>
                    </div>
                    <form className={styles.form} action={canonicalPath}>
                        <input name="name" type="text" placeholder="Ваше имя" autoComplete="name" />
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Телефон *"
                            autoComplete="tel"
                            required
                        />
                        <textarea
                            name="message"
                            rows={4}
                            placeholder="Коротко опишите проект, участок или вопрос"
                        />
                        <button type="submit">{formButton}</button>
                        <p>
                            Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных.
                        </p>
                    </form>
                </section>
            </Container>
        </div>
    );
}
