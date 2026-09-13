import Image from "next/image";
import type { HomeStagesViewProps } from "./home-stages.types";
import styles from "./home-stages.module.css";

function Caret() {
    return (
        <svg viewBox="0 0 10 5" aria-hidden className={styles.caret}>
            <path
                d="M9.05.63 4.84 4 .63.63"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.26"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function HomeStages({
    heading,
    lead,
    items,
    activeId,
    openId,
    onActivate,
    onListLeave,
    onToggle,
}: HomeStagesViewProps) {
    return (
        <section data-section="stages" className={`section ${styles.root}`}>
            <div className={`container-page ${styles.inner}`}>
                <div className={styles.head}>
                    <h2 className={styles.title}>{heading}</h2>
                    <p className={styles.lead}>{lead}</p>
                </div>
                <div className={styles.list} onMouseLeave={onListLeave}>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.row} ${item.id === activeId ? styles.rowActive : ""}`}
                            onMouseEnter={() => onActivate(item.id)}
                        >
                            <div className={styles.rowTitle}>{item.title}</div>
                            <div className={styles.rowText}>{item.text}</div>
                            <Image
                                src={item.image}
                                alt=""
                                width={430}
                                height={348}
                                unoptimized
                                className={styles.rowImg}
                            />
                        </div>
                    ))}
                </div>
                <div className={styles.accordion}>
                    {items.map((item) => {
                        const open = openId === item.id;
                        return (
                            <div
                                key={item.id}
                                className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
                            >
                                <button
                                    type="button"
                                    className={styles.panelHead}
                                    aria-expanded={open}
                                    onClick={() => onToggle(item.id)}
                                >
                                    <span className={styles.panelTitle}>
                                        {item.title}
                                    </span>
                                    <span className={styles.caretWrap}>
                                        <Caret />
                                    </span>
                                </button>
                                {open ? (
                                    <div className={styles.panelBody}>
                                        <p className={styles.panelText}>
                                            {item.text}
                                        </p>
                                        <div className={styles.panelPhoto}>
                                            <div className={styles.panelPhotoBg}>
                                                <Image
                                                    src={item.image}
                                                    alt=""
                                                    width={580}
                                                    height={480}
                                                    unoptimized
                                                    className={styles.panelImg}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
