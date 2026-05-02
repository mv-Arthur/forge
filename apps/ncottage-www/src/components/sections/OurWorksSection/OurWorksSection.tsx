"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const SCROLL_STEP = 420;

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
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = trackRef.current;
        if (!node) return;
        function update() {
            if (!node) return;
            setAtStart(node.scrollLeft <= 1);
            setAtEnd(
                node.scrollLeft + node.clientWidth >= node.scrollWidth - 1
            );
        }
        update();
        node.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            node.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    function scrollBy(direction: 1 | -1) {
        trackRef.current?.scrollBy({
            left: direction * SCROLL_STEP,
            behavior: "smooth",
        });
    }

    return (
        <section className={styles.section}>
            <Container>
                <SectionHeading
                    eyebrow={eyebrow}
                    title={title}
                    titleAccent={titleAccent}
                    lead={lead}
                    align="left"
                    className={styles.head}
                    actions={
                        <>
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => scrollBy(-1)}
                                disabled={atStart}
                                aria-label="Назад"
                            >
                                ←
                            </button>
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => scrollBy(1)}
                                disabled={atEnd}
                                aria-label="Вперёд"
                            >
                                →
                            </button>
                        </>
                    }
                />
            </Container>

            <div className={styles.track} ref={trackRef}>
                <div className={styles.trackInner}>
                    {objects.map((obj) => (
                        <Link
                            key={obj.id}
                            href={obj.href}
                            className={styles.card}
                        >
                            <div className={styles.cardImage}>
                                <img
                                    src={obj.image}
                                    alt={obj.title}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>
                                    {obj.title}
                                </h3>
                                <div className={styles.cardMeta}>
                                    {obj.location && (
                                        <span>{obj.location}</span>
                                    )}
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
                </div>
            </div>

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
