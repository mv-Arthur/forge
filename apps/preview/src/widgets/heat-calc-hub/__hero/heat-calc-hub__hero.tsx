import Image from "next/image";
import { DETAIL_CALC_TITLE, HEAT_CALC_PAGE_LEAD } from "@/lib/copy";
import styles from "./hero.module.css";

const HERO_IMAGE = "/media/catalog/consult.jpg";

export function HeatCalcHubHero() {
    return (
        <section data-section="heat-calc-hero" className={styles.root}>
            <div className={styles.copy}>
                <h1 className={styles.title}>{DETAIL_CALC_TITLE}</h1>
                <p className={styles.lead}>{HEAT_CALC_PAGE_LEAD}</p>
            </div>
            <div className={styles.visual}>
                <Image
                    src={HERO_IMAGE}
                    alt=""
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 992px) 42vw, 100vw"
                    className={styles.image}
                />
            </div>
        </section>
    );
}
