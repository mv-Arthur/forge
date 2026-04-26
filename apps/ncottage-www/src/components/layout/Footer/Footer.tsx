"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FooterContent, FooterMenu } from "@/lib/constants";
import { FOOTER, SOCIAL } from "@/lib/constants";
import styles from "./Footer.module.css";

interface FooterProps {
    content?: FooterContent;
    vkHref?: string;
}

export function Footer({ content = FOOTER, vkHref = SOCIAL.vk }: FooterProps) {
    const [showToTop, setShowToTop] = useState(false);

    useEffect(() => {
        function update() {
            setShowToTop(window.scrollY > 300);
        }
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.wrapper}>
                <div className={styles.top}>
                    <div className={styles.left}>
                        <div className={styles.menus}>
                            <Menu menu={content.projects} />
                            <Menu menu={content.company} />
                        </div>
                        <div className={styles.underMenu}>
                            <div className={styles.social}>
                                <span className={styles.socialTitle}>
                                    {content.socialLabel}
                                </span>
                                <div className={styles.socialButton}>
                                    <a
                                        href={vkHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="ВКонтакте"
                                    >
                                        <VkIcon />
                                    </a>
                                </div>
                            </div>
                            <div className={styles.legal}>
                                <p>ОГРН: {content.legal.ogrn}</p>
                                <p>ИНН: {content.legal.inn}</p>
                                <p>КПП: {content.legal.kpp}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <Menu menu={content.services} />
                        <div className={styles.contactBlock}>
                            <div className={styles.menuTitle}>
                                {content.contactsTitle}
                            </div>
                            {content.offices.map((office) => (
                                <div
                                    key={office.phone.number}
                                    className={styles.contactsInfo}
                                >
                                    <span className={styles.addressBlock}>
                                        <PinIcon />
                                        <span className={styles.addressBox}>
                                            <p>{office.address}</p>
                                            <span className={styles.btnContact}>
                                                <Link href={office.mapHref}>
                                                    {content.mapLinkLabel}
                                                </Link>
                                            </span>
                                        </span>
                                    </span>
                                    <p>
                                        <ClockIcon />
                                        {office.hours}
                                    </p>
                                    <span>
                                        <MailIcon />
                                        <a href={`mailto:${office.email}`}>
                                            {office.email}
                                        </a>
                                    </span>
                                    <span>
                                        <PhoneIcon />
                                        <a
                                            href={`tel:${office.phone.number}`}
                                            className={styles.phoneBtn}
                                        >
                                            {office.phone.display}
                                        </a>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <span>{content.copyright}</span>
                    {content.bottomLinks.map((link, idx) => (
                        <span key={link.label}>
                            <a
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={
                                    link.external
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                            >
                                {link.label}
                            </a>
                            {idx < content.bottomLinks.length - 1 && (
                                <span className={styles.delimiter}>|</span>
                            )}
                        </span>
                    ))}
                </div>
                <div className={styles.bottom}>
                    <p>{content.disclaimer}</p>
                </div>
                <button
                    type="button"
                    className={`${styles.toTop}${showToTop ? ` ${styles.toTopVisible}` : ""}`}
                    onClick={scrollToTop}
                    aria-label={content.toTopLabel}
                >
                    <UpArrowIcon />
                </button>
            </div>
        </footer>
    );
}

function Menu({ menu }: { menu: FooterMenu }) {
    return (
        <div className={styles.menuBlock}>
            <div className={styles.menuTitle}>{menu.title}</div>
            <ul className={styles.menuList}>
                {menu.items.map((item) => (
                    <li key={item.href + item.label}>
                        <Link href={item.href}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function VkIcon() {
    return (
        <svg
            width="24"
            height="14"
            viewBox="0 0 24 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M21.28 5.73c.34-.45.61-.8.81-1.07 1.44-1.91 2.07-3.14 1.87-3.67l-.07-.13c-.05-.07-.18-.14-.39-.21-.21-.06-.47-.07-.8-.03L19.1.65a.7.7 0 0 0-.25.04l-.07.04-.05.04c-.04.02-.09.06-.14.13-.05.06-.09.13-.12.22-.4 1.01-.84 1.95-1.34 2.81a23.5 23.5 0 0 1-.85 1.36c-.26.38-.48.66-.65.84a3.7 3.7 0 0 1-.48.43c-.14.11-.25.16-.32.14a.86.86 0 0 1-.21-.05c-.12-.07-.21-.18-.28-.3a1.6 1.6 0 0 1-.14-.49 5.2 5.2 0 0 1-.04-.51 5.2 5.2 0 0 1 .01-.6c0-.26 0-.43 0-.52 0-.32.01-.66.02-1.03l.03-.88c.01-.22.02-.45.02-.69 0-.24-.01-.43-.04-.57a1.5 1.5 0 0 0-.13-.4 1.1 1.1 0 0 0-.26-.3 1.3 1.3 0 0 0-.42-.17C12.79.06 12.23.01 11.55 0c-1.55-.01-2.55.08-2.99.3-.18.1-.33.22-.48.38-.15.18-.17.28-.06.3.5.07.85.25 1.06.53l.07.15c.06.11.12.3.18.58.06.27.1.58.11.91.04.61.04 1.13 0 1.56-.04.43-.08.77-.12 1.01a1.7 1.7 0 0 1-.17.59 1.4 1.4 0 0 1-.16.27.4.4 0 0 1-.06.06.86.86 0 0 1-.34.06c-.12 0-.26-.06-.42-.18-.17-.12-.34-.28-.52-.48a8 8 0 0 1-.6-.86c-.23-.36-.46-.8-.7-1.3l-.2-.36-.52-.85c-.22-.45-.41-.88-.57-1.3a.7.7 0 0 0-.27-.4l-.06-.04a.5.5 0 0 0-.19-.1.6.6 0 0 0-.18-.08L.8.63c-.35 0-.59.08-.71.24L.04.94A.4.4 0 0 0 0 1.14c0 .09.03.2.08.34.5 1.18 1.04 2.31 1.63 3.4.59 1.09 1.1 1.97 1.53 2.64.43.66.87 1.3 1.32 1.89.45.59.75.97.9 1.13.14.17.26.29.34.38l.31.3c.2.2.5.44.88.72.39.28.82.55 1.29.82.47.27 1.02.49 1.65.66.62.17 1.23.24 1.82.21h1.44c.29-.03.51-.12.66-.28l.05-.06c.03-.05.06-.13.09-.23a1 1 0 0 0 .04-.27c-.01-.36.02-.68.08-.97.06-.29.13-.5.21-.65a1.6 1.6 0 0 1 .27-.37c.1-.1.17-.16.21-.18l.1-.05c.2-.07.43 0 .7.2.27.2.53.44.76.72.24.29.52.61.86.97.33.36.62.62.87.8l.25.14c.17.1.39.19.65.27.27.08.5.1.7.06l3.2-.05c.32 0 .56-.05.74-.16a.55.55 0 0 0 .29-.34.95.95 0 0 0-.04-.42 2.1 2.1 0 0 0-.09-.27 1.5 1.5 0 0 0-.08-.16c-.42-.75-1.21-1.67-2.39-2.76l-.03-.03h-.01l-.01-.01c-.53-.5-.87-.85-1.01-1.02-.26-.33-.31-.67-.17-1.01.1-.26.47-.8 1.12-1.64Z"
                fill="#363636"
            />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg
            width="19"
            height="24"
            viewBox="0 0 19 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 1c3 0 5.7 1.4 7.4 3.8 1.7 2.4 2.1 5.5 1 8.2-.27.74-.71 1.45-1.3 2.13L9.6 22.73a.78.78 0 0 1-1.18 0L1.87 15.14a6.4 6.4 0 0 1-1.3-2.13C-.46 10.3-.07 7.24 1.62 4.83 3.31 2.39 6 1 9 1Zm5.94 13.14c.47-.54.81-1.1 1.03-1.66.85-2.24.53-4.78-.87-6.78a7.41 7.41 0 0 0-12.2 0 7.41 7.41 0 0 0-.88 6.78c.21.57.56 1.13 1.03 1.66L9 21.04l5.94-6.9Z"
                fill="#cccccc"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 10a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm1.43 0a2.57 2.57 0 1 0 5.14 0 2.57 2.57 0 0 0-5.14 0Z"
                fill="#cccccc"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 9.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Zm1.19 0a8.31 8.31 0 1 0 16.62 0 8.31 8.31 0 0 0-16.62 0Z"
                fill="#cccccc"
            />
            <path
                d="M10.2 3.7H8.97v6.25l3.88 3.78.87-.85L10.2 9.45V3.7Z"
                fill="#cccccc"
            />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg
            width="19"
            height="15"
            viewBox="0 0 19 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.31 1H1.69C.76 1 0 1.76 0 2.69v10.13c0 .93.76 1.69 1.69 1.69h14.62c.93 0 1.69-.76 1.69-1.69V2.68c0-.92-.76-1.68-1.69-1.68Zm0 1.13c.08 0 .15.01.22.04L9 8.69 1.47 2.17c.07-.03.14-.04.22-.04h14.62ZM1.13 12.81a.56.56 0 0 0 .56.56h14.62a.56.56 0 0 0 .56-.56V3.36L9.37 9.86a.56.56 0 0 1-.74 0L1.13 3.36v9.45Z"
                fill="#cccccc"
            />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M14 11.05a.5.5 0 0 0-.03-.21 1.76 1.76 0 0 0-.76-.53C12.65 10 12.07 9.69 11.51 9.36a2.05 2.05 0 0 0-.88-.46c-.61 0-1.5 1.8-2.04 1.8a2.14 2.14 0 0 1-.85-.39A9.9 9.9 0 0 1 3.67 6.25 2.13 2.13 0 0 1 3.28 5.4c0-.54 1.8-1.42 1.8-2.03a2.05 2.05 0 0 0-.46-.88c-.32-.56-.63-1.14-.95-1.7A1.76 1.76 0 0 0 3.14.03.5.5 0 0 0 2.94 0a4.43 4.43 0 0 0-1.39.31A2.62 2.62 0 0 0 .5 1.52a3.79 3.79 0 0 0-.51 1.85 7.64 7.64 0 0 0 .69 2.6 9.29 9.29 0 0 0 .82 1.74 16.78 16.78 0 0 0 4.78 4.77 9.28 9.28 0 0 0 1.74.83 7.67 7.67 0 0 0 2.61.69 3.8 3.8 0 0 0 1.85-.51 2.62 2.62 0 0 0 1.21-1.05A4.42 4.42 0 0 0 14 11.05Z"
                fill="#cccccc"
            />
        </svg>
    );
}

function UpArrowIcon() {
    return (
        <svg
            width="19"
            height="12"
            viewBox="0 0 19 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="m2.31 10.85.07.07.08-.08L9.44 3.49l7 7.36.07.07.07-.07 1.38-1.46.07-.07-.07-.07-7.53-7.92a1.42 1.42 0 0 0-2.06 0L.93 9.25l-.07.07.07.07 1.38 1.46Z"
                fill="#50983C"
                stroke="#50983C"
                strokeWidth="0.2"
            />
        </svg>
    );
}
