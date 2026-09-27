import Image from "next/image";
import styles from "./hero__background.module.css";

export function HeroBackground({ src }: { src: string }) {
    return (
        <div className={styles.root}>
            <Image
                src={src}
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
            />
        </div>
    );
}
