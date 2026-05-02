"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProjectGallery.module.css";

interface ProjectGalleryProps {
    images: string[];
    alt: string;
}

export function ProjectGallery({ images, alt }: ProjectGalleryProps) {
    const list = images.length > 0 ? images : [];
    const [active, setActive] = useState(0);

    if (list.length === 0) return null;

    const main = list[active];
    const thumbs = list.slice(0, 4);

    return (
        <div className={styles.gallery}>
            <div className={styles.main}>
                <Image
                    src={main}
                    alt={alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 66vw"
                    priority
                    className={styles.mainImage}
                />
            </div>
            {list.length > 1 && (
                <div className={styles.thumbs}>
                    {thumbs.map((src, i) => (
                        <button
                            key={`${src}-${i}`}
                            type="button"
                            className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
                            onClick={() => setActive(i)}
                            aria-label={`Фото ${i + 1}`}
                            aria-pressed={i === active}
                        >
                            <Image
                                src={src}
                                alt=""
                                fill
                                sizes="33vw"
                                className={styles.thumbImage}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
