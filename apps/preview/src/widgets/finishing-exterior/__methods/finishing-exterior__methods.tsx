import Image from "next/image";
import { EXTERIOR_METHODS_HEADING } from "@/lib/copy";
import { EXTERIOR_METHODS } from "../lib/content";
import styles from "./methods.module.css";

export function FinishingExteriorMethods() {
    return (
        <section data-section="exterior-methods" className={styles.root}>
            <h2 className={styles.heading}>{EXTERIOR_METHODS_HEADING}</h2>
            <div className={styles.grid}>
                {EXTERIOR_METHODS.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <div className={styles.photo}>
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width:768px) 50vw, 100vw"
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.body}>
                            <h3 className={styles.title}>
                                <span className={styles.n}>{item.n}</span>
                                {item.title}
                            </h3>
                            <p className={styles.text}>{item.text}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
