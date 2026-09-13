import Image from "next/image";
import Link from "next/link";
import { PillTabs } from "@/ui/pill-tabs";
import { projectsWord } from "@/lib/format";
import type { Technology } from "@/types/catalog";
import type { HomeTechViewProps } from "./home-tech.types";
import styles from "./home-tech.module.css";

export function HomeTech({
    heading,
    cta,
    slides,
    thumbs,
    active,
    onTab,
}: HomeTechViewProps) {
    const slide = slides.find((s) => s.id === active) ?? slides[0];
    if (!slide) return null;

    return (
        <section data-section="tech" className={`section ${styles.root}`}>
            <div className={`container-page ${styles.grid}`}>
                <div className={styles.intro}>
                    <h2 className={styles.title}>{heading}</h2>
                    <div className={styles.tabsWrap}>
                        <PillTabs
                            items={slides.map((s) => ({
                                id: s.id,
                                label: s.tab,
                            }))}
                            value={slide.id}
                            onChange={(id) => onTab(id as Technology)}
                        />
                    </div>
                </div>
                <div className={styles.visual}>
                    <div className={styles.house}>
                        <Image
                            key={slide.house}
                            src={slide.house}
                            alt={slide.houseAlt}
                            fill
                            unoptimized
                            quality={92}
                            sizes="(min-width:1280px) 960px, (min-width:960px) 70vw, 100vw"
                            style={{ objectFit: "contain", objectPosition: "center" }}
                            priority={slide.id === slides[0]?.id}
                        />
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.copy}>
                        <h3 className={styles.heading}>{slide.title}</h3>
                        <p className={styles.lead}>{slide.lead}</p>
                    </div>
                    <div className={styles.samples}>
                        {slide.samples.map((sample) => (
                            <div key={sample.src} className={styles.sample}>
                                <Image
                                    src={sample.src}
                                    alt={sample.alt}
                                    fill
                                    unoptimized
                                    sizes="200px"
                                />
                            </div>
                        ))}
                    </div>
                    <div className={styles.footer}>
                        <Link
                            href={slide.href}
                            className={`btn btn-primary ${styles.cta}`}
                        >
                            {cta}
                        </Link>
                        <div className={styles.faces}>
                            <div className={styles.stack}>
                                {thumbs.map((src) => (
                                    <span key={src} className={styles.face}>
                                        <Image
                                            src={src}
                                            alt=""
                                            fill
                                            unoptimized
                                            sizes="48px"
                                        />
                                    </span>
                                ))}
                            </div>
                            <span className={styles.count}>
                                {slide.count} {projectsWord(slide.count)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
