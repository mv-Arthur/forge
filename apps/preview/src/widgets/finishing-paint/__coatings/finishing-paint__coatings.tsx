import Image from "next/image";
import { PAINT_COATINGS_HEADING, PAINT_COATINGS_LEAD } from "@/lib/copy";
import { PAINT_COATINGS } from "../lib/content";
import styles from "./coatings.module.css";

export function FinishingPaintCoatings() {
    return (
        <section data-section="paint-coatings" className={styles.root}>
            <h2 className={styles.heading}>{PAINT_COATINGS_HEADING}</h2>
            <p className={styles.lead}>{PAINT_COATINGS_LEAD}</p>
            <div className={styles.grid}>
                {PAINT_COATINGS.map((group) => (
                    <article key={group.id} className={styles.card}>
                        <div className={styles.photo}>
                            <Image
                                src={group.cover}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width:768px) 50vw, 100vw"
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.body}>
                            <h3 className={styles.title}>{group.title}</h3>
                            <p className={styles.text}>{group.text}</p>
                            <ul className={styles.swatches}>
                                {group.swatches.map((swatch) => (
                                    <li key={swatch.id} className={styles.swatch}>
                                        <div className={styles.swatchPhoto}>
                                            <Image
                                                src={swatch.image}
                                                alt=""
                                                fill
                                                unoptimized
                                                sizes="120px"
                                                className={styles.swatchImage}
                                            />
                                        </div>
                                        <span className={styles.swatchLabel}>
                                            {swatch.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
