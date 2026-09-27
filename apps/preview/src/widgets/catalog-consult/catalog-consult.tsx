import Image from "next/image";
import { CATALOG_CONSULT_CTA, CATALOG_CONSULT_LEAD } from "@/lib/copy";
import type { CatalogConsultProps } from "./catalog-consult.types";
import styles from "./catalog-consult.module.css";

export function CatalogConsult({ onCta }: CatalogConsultProps) {
    return (
        <div className={styles.root} data-section="catalog-consult">
            <div className={styles.copy}>
                <h2 className={styles.title}>
                    <span className={styles.line}>Не нашли подходящий </span>
                    дом?
                </h2>
                <p className={styles.lead}>{CATALOG_CONSULT_LEAD}</p>
                <button type="button" className={styles.btn} onClick={onCta}>
                    {CATALOG_CONSULT_CTA}
                </button>
            </div>
            <div className={styles.visual}>
                <Image
                    src="/media/catalog/consult.jpg"
                    unoptimized
                    alt=""
                    fill
                    sizes="(min-width: 768px) 420px, 100vw"
                    className={styles.photo}
                />
            </div>
        </div>
    );
}
