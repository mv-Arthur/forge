import Image from "next/image";
import banner from "../assets/banner.jpg";
import styles from "./hero__background.module.css";

export function HeroBackground() {
    return (
        <div className={styles.root}>
            <Image
                src={banner}
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
            />
        </div>
    );
}
