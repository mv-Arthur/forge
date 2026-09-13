import type { ReactNode } from "react";
import Image from "next/image";
import {
    LEAD_HOME_HEADING,
    LEAD_HOME_TEXT,
    LEAD_MESSENGER_HEADING,
    LEAD_MESSENGER_LEAD,
    LEAD_MAX,
    LEAD_TG,
} from "@/lib/copy";
import { MaxIcon, TelegramIcon } from "@/ui/icons";
import styles from "./home-lead.module.css";

export function HomeLead({
    telegram,
    max,
    form,
}: {
    telegram: string;
    max: string;
    form: ReactNode;
}) {
    return (
        <section id="lead" data-section="lead" className={`section ${styles.root}`}>
            <div className={`container-page ${styles.grid}`}>
                <div className={styles.card}>
                    <h2 className={styles.title}>{LEAD_HOME_HEADING}</h2>
                    <p className={styles.text}>{LEAD_HOME_TEXT}</p>
                    <div className={styles.form}>{form}</div>
                </div>
                <div className={styles.photo}>
                    <Image
                        src="/media/lead/office.jpg"
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width:992px) 60vw, 100vw"
                        className={styles.photoImg}
                    />
                    <div className={styles.photoShade} />
                    <div className={styles.photoCopy}>
                        <h3 className={styles.photoTitle}>
                            {LEAD_MESSENGER_HEADING}
                        </h3>
                        <p className={styles.photoLead}>{LEAD_MESSENGER_LEAD}</p>
                        <div className={styles.messengers}>
                            <a
                                href={telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.msg}
                            >
                                <TelegramIcon className={styles.msgIcon} />
                                {LEAD_TG}
                            </a>
                            <a
                                href={max}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.msg}
                            >
                                <MaxIcon className={styles.msgMax} />
                                {LEAD_MAX}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
