import Image from "next/image";
import { FACADE_MATERIALS_HEADING } from "@/lib/copy";
import { FACADE_MATERIALS } from "../lib/content";
import styles from "./materials.module.css";

export function FinishingFacadeMaterials() {
    return (
        <section data-section="facade-materials" className={styles.root}>
            <h2 className={styles.heading}>{FACADE_MATERIALS_HEADING}</h2>
            <div className={styles.grid}>
                {FACADE_MATERIALS.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <div className={styles.photo}>
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width:992px) 33vw, (min-width:640px) 50vw, 100vw"
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.body}>
                            <h3 className={styles.title}>{item.title}</h3>
                            <p className={styles.text}>{item.text}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
