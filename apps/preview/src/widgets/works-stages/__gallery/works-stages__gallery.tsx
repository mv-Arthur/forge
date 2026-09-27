import Image from "next/image";
import {
    WORKS_STAGES_COLS_1,
    WORKS_STAGES_COLS_2,
    WORKS_STAGES_COLS_3,
} from "@/lib/copy";
import type {
    WorksStagesCols,
    WorksStagesGalleryProps,
} from "../works-stages.types";
import styles from "./gallery.module.css";

function Col1Icon() {
    return (
        <svg viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
                d="M4.12.75C2.53.75 1.74.75 1.24 1.19.75 1.63.75 2.34.75 3.75c0 1.41 0 2.12.49 2.56.49.44 1.29.44 2.88.44h9.26c1.59 0 2.38 0 2.88-.44.49-.44.49-1.15.49-2.56 0-1.41 0-2.12-.49-2.56C16.26.75 15.47.75 13.88.75H4.12Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M4.12 10.75c-1.59 0-2.38 0-2.88.44-.49.44-.49 1.15-.49 2.56 0 1.41 0 2.12.49 2.56.5.44 1.29.44 2.88.44h9.26c1.59 0 2.38 0 2.88-.44.49-.44.49-1.15.49-2.56 0-1.41 0-2.12-.49-2.56-.5-.44-1.29-.44-2.88-.44H4.12Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}

function Col2Icon() {
    return (
        <svg viewBox="0 0 22 22" aria-hidden>
            <rect x=".33" y=".33" width="9.23" height="9.23" rx="1" />
            <rect x=".33" y="12.44" width="9.23" height="9.23" rx="1" />
            <rect x="12.44" y=".33" width="9.23" height="9.23" rx="1" />
            <rect x="12.44" y="12.44" width="9.23" height="9.23" rx="1" />
        </svg>
    );
}

function Col3Icon() {
    return (
        <svg viewBox="0 0 22 22" aria-hidden>
            <rect x=".33" y=".33" width="5.41" height="5.41" rx="1" />
            <rect x=".33" y="8.3" width="5.41" height="5.41" rx="1" />
            <rect x=".33" y="16.26" width="5.41" height="5.41" rx="1" />
            <rect x="8.3" y=".33" width="5.41" height="5.41" rx="1" />
            <rect x="16.26" y=".33" width="5.41" height="5.41" rx="1" />
            <rect x="8.3" y="8.3" width="5.41" height="5.41" rx="1" />
            <rect x="16.26" y="8.3" width="5.41" height="5.41" rx="1" />
            <rect x="8.3" y="16.26" width="5.41" height="5.41" rx="1" />
            <rect x="16.26" y="16.26" width="5.41" height="5.41" rx="1" />
        </svg>
    );
}

const COLS: { id: WorksStagesCols; label: string }[] = [
    { id: 1, label: WORKS_STAGES_COLS_1 },
    { id: 2, label: WORKS_STAGES_COLS_2 },
    { id: 3, label: WORKS_STAGES_COLS_3 },
];

function ColIcon({ id }: { id: WorksStagesCols }) {
    if (id === 1) return <Col1Icon />;
    if (id === 3) return <Col3Icon />;
    return <Col2Icon />;
}

export function WorksStagesGallery({
    title,
    photos,
    cols,
    onCols,
    onOpen,
}: WorksStagesGalleryProps) {
    return (
        <div>
            <div className={styles.head}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.filters} role="group">
                    {COLS.map((col) => {
                        const on = cols === col.id;
                        return (
                            <button
                                key={col.id}
                                type="button"
                                className={`${styles.filter} ${
                                    on ? styles.filterOn : ""
                                }`}
                                aria-label={col.label}
                                aria-pressed={on}
                                title={col.label}
                                onClick={() => onCols(col.id)}
                            >
                                <ColIcon id={col.id} />
                            </button>
                        );
                    })}
                </div>
            </div>
            {photos.length > 0 ? (
                <div
                    className={`${styles.grid} ${
                        cols === 1
                            ? styles.cols1
                            : cols === 3
                              ? styles.cols3
                              : styles.cols2
                    }`}
                >
                    {photos.map((src, i) => (
                        <button
                            key={`${src}-${i}`}
                            type="button"
                            className={styles.item}
                            onClick={() => onOpen(i)}
                        >
                            <Image
                                src={src}
                                alt=""
                                fill
                                unoptimized={src.startsWith("/media/")}
                                sizes={
                                    cols === 1
                                        ? "(min-width: 960px) 840px, 100vw"
                                        : cols === 3
                                          ? "(min-width: 960px) 270px, 50vw"
                                          : "(min-width: 960px) 410px, 100vw"
                                }
                                className={styles.image}
                            />
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
