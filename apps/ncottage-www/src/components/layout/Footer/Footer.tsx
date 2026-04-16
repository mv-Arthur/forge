import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
    COMPANY_NAME,
    PHONES,
    EMAIL,
    ADDRESSES,
    SOCIAL,
    WORK_HOURS,
    LEGAL,
} from "@/lib/constants";
import styles from "./Footer.module.css";

const PROJECT_LINKS = [
    { label: "Газобетонные дома", href: "/projects?tech=gas-concrete" },
    { label: "Кирпичные дома", href: "/projects?tech=brick" },
    { label: "Каркасные дома", href: "/projects?tech=frame" },
    { label: "Дома из СИП-панелей", href: "/projects?tech=sip" },
    { label: "Фахверковые дома", href: "/projects?tech=fachwerk" },
];

const COMPANY_LINKS = [
    { label: "О компании", href: "/about" },
    { label: "Наши работы", href: "/our-works" },
    { label: "Гарантия", href: "/about#guarantee" },
    { label: "Акции", href: "/promotions" },
    { label: "Отзывы", href: "/reviews" },
];

const SERVICE_LINKS = [
    { label: "Проектирование", href: "/services/design" },
    { label: "Строительство", href: "/services/construction" },
    { label: "Отделка", href: "/services/finishing" },
    { label: "Инженерные сети", href: "/services/engineering" },
    { label: "Благоустройство", href: "/services/landscaping" },
];

export function Footer() {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.grid}>
                    {/* Contacts */}
                    <div className={styles.column}>
                        <Link href="/" className={styles.logo}>
                            {COMPANY_NAME}
                        </Link>
                        <div className={styles.contactBlock}>
                            <p className={styles.label}>Санкт-Петербург</p>
                            <a href={`tel:${PHONES.spb.number}`}>
                                {PHONES.spb.display}
                            </a>
                            <p className={styles.address}>{ADDRESSES.spb}</p>
                        </div>
                        <div className={styles.contactBlock}>
                            <p className={styles.label}>Москва</p>
                            <a href={`tel:${PHONES.msk.number}`}>
                                {PHONES.msk.display}
                            </a>
                        </div>
                        <a href={`mailto:${EMAIL}`} className={styles.email}>
                            {EMAIL}
                        </a>
                        <p className={styles.hours}>{WORK_HOURS}</p>
                    </div>

                    {/* Projects */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Проекты</h4>
                        <ul>
                            {PROJECT_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Компания</h4>
                        <ul>
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Услуги</h4>
                        <ul>
                            {SERVICE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className={styles.bottom}>
                    <div className={styles.social}>
                        <a
                            href={SOCIAL.vk}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="ВКонтакте"
                        >
                            VK
                        </a>
                        <a
                            href={SOCIAL.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Telegram"
                        >
                            TG
                        </a>
                        <a
                            href={SOCIAL.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                        >
                            WA
                        </a>
                    </div>
                    <div className={styles.legal}>
                        <p>
                            ОГРН: {LEGAL.ogrn} | ИНН: {LEGAL.inn} | КПП:{" "}
                            {LEGAL.kpp}
                        </p>
                        <p>
                            &copy; {new Date().getFullYear()} {COMPANY_NAME}.
                            Все права защищены.
                        </p>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
