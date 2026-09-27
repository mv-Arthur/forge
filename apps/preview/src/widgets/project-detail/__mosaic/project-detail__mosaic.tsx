import Image from "next/image";
import type { ShowcaseMosaic, ShowcaseMosaicCard } from "@/types/catalog";
import styles from "./project-detail__mosaic.module.css";

function CardText({ card }: { card: ShowcaseMosaicCard }) {
    return (
        <div className={styles.text}>
            <h2 className={styles.title}>{card.title}</h2>
            <p className={styles.body}>{card.text}</p>
        </div>
    );
}

function CardPhoto({ card }: { card: ShowcaseMosaicCard }) {
    return (
        <figure className={styles.photo}>
            <Image
                src={card.image}
                alt=""
                fill
                unoptimized={card.image.startsWith("/media/")}
                className={styles.img}
                sizes="(min-width: 992px) 33vw, 100vw"
            />
        </figure>
    );
}

export function ProjectDetailMosaic({ mosaic }: { mosaic: ShowcaseMosaic }) {
    return (
        <div className={styles.grid}>
            <div className={styles.col}>
                <CardText card={mosaic.about} />
                <CardPhoto card={mosaic.about} />
            </div>
            <div className={`${styles.col} ${styles.colFlip}`}>
                <CardPhoto card={mosaic.interior} />
                <CardText card={mosaic.interior} />
            </div>
            <div className={styles.col}>
                <CardText card={mosaic.layout} />
                <CardPhoto card={mosaic.layout} />
            </div>
        </div>
    );
}
