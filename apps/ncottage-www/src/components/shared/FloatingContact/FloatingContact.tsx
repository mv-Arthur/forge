"use client";

import { useEffect, useState } from "react";
import { SOCIAL } from "@/content/contacts";
import { useCallbackModal } from "@/lib/callback";
import styles from "./FloatingContact.module.css";

const SCROLL_REVEAL = 320;

interface FloatingContactProps {
    whatsapp?: string;
    telegram?: string;
}

export function FloatingContact({
    whatsapp = SOCIAL.whatsapp,
    telegram = SOCIAL.telegram,
}: FloatingContactProps = {}) {
    const { openCallback } = useCallbackModal();
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > SCROLL_REVEAL);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className={`${styles.root} ${visible ? styles.visible : ""} ${
                open ? styles.open : ""
            }`}
        >
            <div className={styles.actions} aria-hidden={!open}>
                <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.action} ${styles.whatsapp}`}
                    aria-label="Написать в WhatsApp"
                    tabIndex={open ? 0 : -1}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.18c-.25.69-1.46 1.32-2 1.4-.51.08-1.16.11-1.87-.12-.43-.14-.99-.32-1.7-.63-2.99-1.29-4.94-4.3-5.09-4.5-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.04-2.49.27-.3.59-.37.79-.37.2 0 .39.002.57.01.18.008.43-.07.67.51.25.6.84 2.07.91 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.37 1.46.3.15.47.12.65-.07.18-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2 .96.3.15.5.22.57.35.07.13.07.74-.18 1.43Z"
                        />
                    </svg>
                </a>
                <a
                    href={telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.action} ${styles.telegram}`}
                    aria-label="Написать в Telegram"
                    tabIndex={open ? 0 : -1}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M21.94 4.66 18.9 19c-.23 1.01-.83 1.26-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.74 8.62-7.79c.38-.33-.08-.52-.58-.19L7.04 13.4l-4.59-1.44c-1-.31-1.02-1 .21-1.48l17.94-6.92c.83-.31 1.56.19 1.34 1.1Z"
                        />
                    </svg>
                </a>
                <button
                    type="button"
                    className={`${styles.action} ${styles.callback}`}
                    aria-label="Заказать звонок"
                    tabIndex={open ? 0 : -1}
                    onClick={() => {
                        setOpen(false);
                        openCallback();
                    }}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2Z"
                        />
                    </svg>
                </button>
            </div>
            <button
                type="button"
                className={styles.toggle}
                aria-expanded={open}
                aria-label={open ? "Скрыть способы связи" : "Связаться с нами"}
                onClick={() => setOpen((v) => !v)}
            >
                <svg
                    viewBox="0 0 24 24"
                    width="26"
                    height="26"
                    aria-hidden="true"
                >
                    {open ? (
                        <path
                            fill="currentColor"
                            d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.41 6.3 6.3-6.3 6.3 1.4 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"
                        />
                    ) : (
                        <path
                            fill="currentColor"
                            d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-3 11H7v-2h10v2Zm0-3H7V8h10v2Z"
                        />
                    )}
                </svg>
            </button>
        </div>
    );
}
