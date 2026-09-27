import Link from "next/link";
import Image from "next/image";
import { settings } from "@/lib/settings";
import { MaxIcon, PhoneIcon, TelegramIcon } from "@/ui/icons";
import { Container } from "@/ui/container";
import { routes } from "@/lib/routes";
import styles from "./site-footer.module.css";

const linkCols = [
    {
        title: "Проекты",
        links: [
            { href: routes.catalog, label: "Каталог" },
            { href: routes.projects(), label: "Все проекты" },
            { href: routes.projects({ tech: "gas_concrete" }), label: "Газобетон" },
            { href: routes.projects({ tech: "brick" }), label: "Кирпич" },
            { href: routes.projects({ tech: "frame" }), label: "Каркас" },
            { href: routes.projects({ tech: "sip" }), label: "СИП" },
        ],
    },
    {
        title: "Портфолио",
        links: [{ href: routes.works, label: "Фотогалерея" }],
    },
];

export function SiteFooter() {
    return (
        <footer data-section="site-footer" className={styles.root}>
            <Container className={styles.grid}>
                <div>
                    <Link href={routes.home} className={styles.logo}>
                        <Image
                            src="/images/logo-header.png"
                            alt="Новый Коттедж"
                            width={726}
                            height={300}
                            className={styles.logoImg}
                        />
                    </Link>
                    <p className={styles.about}>
                        Строим дома под ключ в Санкт-Петербурге и Ленинградской
                        области с {settings.foundedYear} года. Договор с
                        фиксированной сметой, гарантия {settings.warrantyYears}{" "}
                        лет.
                    </p>
                    <div className={styles.contacts}>
                        <a
                            href={`tel:${settings.phoneClean}`}
                            className={styles.phone}
                        >
                            <PhoneIcon className={styles.icon} />
                            {settings.phone}
                        </a>
                        <div className={styles.messengers}>
                            <a
                                href={settings.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-tg btn-sm"
                            >
                                <TelegramIcon className={styles.icon} />
                                Telegram
                            </a>
                            <a
                                href={settings.max}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-max btn-sm"
                            >
                                <MaxIcon className={styles.icon} />
                                MAX
                            </a>
                        </div>
                    </div>
                </div>
                {linkCols.map((col) => (
                    <div key={col.title}>
                        <div className={styles.colTitle}>{col.title}</div>
                        <ul className={styles.colList}>
                            {col.links.map((l) => (
                                <li key={l.href + l.label}>
                                    <Link href={l.href} className={styles.colLink}>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </Container>
            <div className={styles.legal}>
                <Container className={styles.legalInner}>
                    <div>
                        © 2026 «Новый Коттедж» · ИНН {settings.inn} ·
                        Санкт-Петербург
                    </div>
                    <div className={styles.legalLinks}>
                        <Link href={routes.privacy}>
                            Политика конфиденциальности
                        </Link>
                        <Link href={routes.offer}>Оферта</Link>
                    </div>
                </Container>
            </div>
        </footer>
    );
}
