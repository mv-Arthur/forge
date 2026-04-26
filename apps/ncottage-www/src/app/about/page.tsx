import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { StagesSection } from "@/components/sections/StagesSection";
import { ADVANTAGES_SECTION, STAGES_SECTION } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "О компании — Новый Коттедж",
    description:
        "Новый Коттедж — строительная компания с 2018 года. Более 200 реализованных проектов.",
};

export default function AboutPage() {
    return (
        <>
            <section className={styles.page}>
                <Container>
                    <SectionHeading
                        label="О компании"
                        title="Новый Коттедж"
                        description="Мы строим загородные дома с 2018 года. Собственные бригады, прозрачные цены, гарантия качества."
                    />
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>200+</span>
                            <span className={styles.statLabel}>
                                построенных домов
                            </span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>7+</span>
                            <span className={styles.statLabel}>
                                лет на рынке
                            </span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>50+</span>
                            <span className={styles.statLabel}>
                                сотрудников
                            </span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>5 лет</span>
                            <span className={styles.statLabel}>гарантия</span>
                        </div>
                    </div>

                    <div className={styles.textBlock} id="guarantee">
                        <h2 className={styles.subtitle}>Гарантия</h2>
                        <p className={styles.text}>
                            Мы предоставляем официальную гарантию 5 лет на все
                            виды строительных работ. В течение гарантийного
                            срока любые выявленные дефекты устраняются
                            бесплатно. Гарантийные обязательства закреплены в
                            договоре.
                        </p>
                    </div>

                    <div className={styles.textBlock} id="payment">
                        <h2 className={styles.subtitle}>Оплата</h2>
                        <p className={styles.text}>
                            Поэтапная оплата по мере выполнения работ. Принимаем
                            оплату наличными, банковским переводом, а также
                            работаем с ипотекой и материнским капиталом.
                            Стоимость фиксируется в договоре.
                        </p>
                    </div>
                </Container>
            </section>
            <AdvantagesSection
                title={ADVANTAGES_SECTION.title}
                text={ADVANTAGES_SECTION.text}
                background={ADVANTAGES_SECTION.background}
                items={ADVANTAGES_SECTION.items}
            />
            <StagesSection
                title={STAGES_SECTION.title}
                stages={STAGES_SECTION.stages}
            />
        </>
    );
}
