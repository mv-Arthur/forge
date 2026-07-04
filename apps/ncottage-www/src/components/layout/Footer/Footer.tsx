import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import type { FooterContent } from "@/content/site";
import { FOOTER } from "@/content/site";
import { SOCIAL } from "@/content/contacts";
import { UpArrowIcon, VkIcon } from "./icons";
import styles from "./Footer.module.css";

interface FooterProps {
    content?: FooterContent;
    vkHref?: string;
}

export function Footer({ content = FOOTER, vkHref = SOCIAL.vk }: FooterProps) {
    return (
        <footer className={styles.footer}>
            <Container className={styles.inner}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <Link
                            href="/"
                            className={styles.logo}
                            aria-label="Главная"
                        >
                            <Image
                                src="/images/logo.png"
                                alt="Новый Коттедж"
                                width={772}
                                height={317}
                            />
                        </Link>
                        <p className={styles.tagline}>{content.tagline}</p>
                        <div className={styles.social}>
                            <span className={styles.socialLabel}>
                                {content.socialLabel}
                            </span>
                            <a
                                href={vkHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="ВКонтакте"
                                className={styles.socialBtn}
                            >
                                <VkIcon />
                            </a>
                        </div>
                    </div>

                    <div className={styles.col}>
                        <h2 className={styles.colTitle}>{content.nav.title}</h2>
                        <ul className={styles.colList}>
                            {content.nav.items.map((item) => (
                                <li key={item.href + item.label}>
                                    <Link
                                        href={item.href}
                                        className={styles.colLink}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.col}>
                        <h2 className={styles.colTitle}>
                            {content.contactsTitle}
                        </h2>
                        <ul className={styles.contactList}>
                            {content.offices.map((office) => (
                                <li
                                    key={office.phone.number}
                                    className={styles.contactItem}
                                >
                                    <span className={styles.contactCity}>
                                        {office.label}
                                    </span>
                                    <a
                                        href={`tel:${office.phone.number}`}
                                        className={styles.contactPhone}
                                    >
                                        {office.phone.display}
                                    </a>
                                </li>
                            ))}
                            <li className={styles.contactItem}>
                                <a
                                    href={`mailto:${content.email}`}
                                    className={styles.contactLink}
                                >
                                    {content.email}
                                </a>
                                <span className={styles.contactMute}>
                                    {content.workHours}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.col}>
                        <h2 className={styles.colTitle}>Офисы</h2>
                        <ul className={styles.officeList}>
                            {content.offices.map((office) => (
                                <li
                                    key={office.address}
                                    className={styles.officeItem}
                                >
                                    <span className={styles.officeLabel}>
                                        {office.label}
                                    </span>
                                    <span className={styles.officeAddress}>
                                        {office.address}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.middle}>
                    <p className={styles.legal}>
                        ОГРН {content.legal.ogrn} · ИНН {content.legal.inn} ·
                        КПП {content.legal.kpp}
                    </p>
                    <p className={styles.disclaimer}>{content.disclaimer}</p>
                </div>

                <div className={styles.bottom}>
                    <span className={styles.copyright}>
                        {content.copyright}
                    </span>
                    <ul className={styles.bottomLinks}>
                        {content.bottomLinks.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className={styles.bottomLink}
                                    target={
                                        link.external ? "_blank" : undefined
                                    }
                                    rel={
                                        link.external
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>

            <ScrollToTop
                className={styles.toTop}
                visibleClassName={styles.toTopVisible}
                label={content.toTopLabel}
            >
                <UpArrowIcon />
            </ScrollToTop>
        </footer>
    );
}
