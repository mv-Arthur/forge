"use client";

import Link from "next/link";
import { useState } from "react";
import { Carousel } from "@/components/ui/Carousel";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CallbackModal } from "@/components/shared/CallbackModal";
import type { OurWorksSectionContent } from "@/content/home";
import type { BuiltObject } from "@/domain/project";
import styles from "./OurWorksSection.module.css";

interface OurWorksSectionProps {
    eyebrow: OurWorksSectionContent["eyebrow"];
    title: OurWorksSectionContent["title"];
    titleAccent?: OurWorksSectionContent["titleAccent"];
    lead?: OurWorksSectionContent["lead"];
    cta: OurWorksSectionContent["cta"];
    visitInvite: OurWorksSectionContent["visitInvite"];
    objects: BuiltObject[];
}

export function OurWorksSection({
    eyebrow,
    title,
    titleAccent,
    lead,
    cta,
    visitInvite,
    objects,
}: OurWorksSectionProps) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section className={styles.section}>
            <Carousel
                prevLabel="Назад"
                nextLabel="Вперёд"
                renderHeader={(controls) => (
                    <Container>
                        <SectionHeading
                            eyebrow={eyebrow}
                            title={title}
                            titleAccent={titleAccent}
                            lead={lead}
                            align="left"
                            className={styles.head}
                            actions={controls}
                        />
                    </Container>
                )}
            >
                {objects.map((obj) => (
                    <Link key={obj.id} href={obj.href} className={styles.card}>
                        <div className={styles.cardImage}>
                            <img
                                src={obj.image}
                                alt={obj.title}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <div className={styles.cardBody}>
                            <h3 className={styles.cardTitle}>{obj.title}</h3>
                            <div className={styles.cardMeta}>
                                {obj.location && <span>{obj.location}</span>}
                                {obj.area && (
                                    <span className={styles.metaArea}>
                                        {obj.area} м²
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}

                <button
                    type="button"
                    className={styles.invite}
                    onClick={() => setModalOpen(true)}
                >
                    <span className={styles.inviteEyebrow}>
                        {visitInvite.title}
                    </span>
                    <span className={styles.inviteText}>
                        {visitInvite.text}
                    </span>
                    <span className={styles.inviteCta}>
                        {visitInvite.ctaLabel} →
                    </span>
                </button>
            </Carousel>

            <Container>
                <div className={styles.footer}>
                    <Link href={cta.href} className={styles.footerLink}>
                        {cta.label} →
                    </Link>
                </div>
            </Container>
            <CallbackModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </section>
    );
}
