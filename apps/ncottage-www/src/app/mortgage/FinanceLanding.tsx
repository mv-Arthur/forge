import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FinanceLeadForm } from "./FinanceLeadForm";
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

interface RouteStep {
    title: string;
    text: string;
}

interface FinanceLandingProps {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    stats: StatItem[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    routeEyebrow: string;
    routeTitle: string;
    routeSteps: RouteStep[];
    conditionsEyebrow: string;
    conditionsTitle: string;
    conditionsLead: string;
    conditions: CardItem[];
    stepsEyebrow: string;
    stepsTitle: string;
    stepsLead: string;
    steps: CardItem[];
    banksEyebrow: string;
    banksTitle: string;
    banksLead: string;
    banks: BankItem[];
    noteTitle: string;
    noteText: string;
    formEyebrow: string;
    formTitle: string;
    formLead: string;
    formButton: string;
}

export function FinanceLanding({
    eyebrow,
    title,
    titleAccent,
    lead,
    stats,
    primaryCtaLabel,
    secondaryCtaLabel,
    secondaryCtaHref,
    routeEyebrow,
    routeTitle,
    routeSteps,
    conditionsEyebrow,
    conditionsTitle,
    conditionsLead,
    conditions,
    stepsEyebrow,
    stepsTitle,
    stepsLead,
    steps,
    banksEyebrow,
    banksTitle,
    banksLead,
    banks,
    noteTitle,
    noteText,
    formEyebrow,
    formTitle,
    formLead,
    formButton,
}: FinanceLandingProps) {
    return (
        <div className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[{ label: "Главная", href: "/" }, { label: title }]}
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
                                {primaryCtaLabel}
                            </a>
                            <Link
                                href={secondaryCtaHref}
                                className={styles.secondaryLink}
                            >
                                {secondaryCtaLabel}
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

                <section className={styles.route} aria-label={routeEyebrow}>
                    <div className={styles.routeIntro}>
                        <span>{routeEyebrow}</span>
                        <strong>{routeTitle}</strong>
                    </div>
                    <ol className={styles.routeSteps}>
                        {routeSteps.map((step, index) => (
                            <li key={step.title}>
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <strong>{step.title}</strong>
                                <p>{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow={conditionsEyebrow}
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
                        eyebrow={stepsEyebrow}
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
                            eyebrow={banksEyebrow}
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
                            <article
                                key={bank.name}
                                className={styles.bankCard}
                            >
                                <span className={styles.bankLogo}>
                                    {bank.name}
                                </span>
                                <p>{bank.note}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="lead-form" className={styles.formSection}>
                    <div className={styles.formIntro}>
                        <span className={styles.formEyebrow}>
                            {formEyebrow}
                        </span>
                        <h2>{formTitle}</h2>
                        <p>{formLead}</p>
                    </div>
                    <FinanceLeadForm buttonLabel={formButton} program={title} />
                </section>
            </Container>
        </div>
    );
}
