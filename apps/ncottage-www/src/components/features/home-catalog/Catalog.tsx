"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CallbackModal } from "@/components/shared/CallbackModal";
import { ProductCard } from "@/components/shared/ProductCard";
import type { CatalogSectionContent } from "@/content/home";
import type { Project } from "@/domain/project";
import styles from "./Catalog.module.css";

interface CatalogProps {
    eyebrow: CatalogSectionContent["eyebrow"];
    title: CatalogSectionContent["title"];
    titleAccent?: CatalogSectionContent["titleAccent"];
    lead?: CatalogSectionContent["lead"];
    tabs: CatalogSectionContent["tabs"];
    cta: CatalogSectionContent["cta"];
    customProject: CatalogSectionContent["customProject"];
    projects: Project[];
}

export function Catalog({
    eyebrow,
    title,
    titleAccent,
    lead,
    tabs,
    cta,
    customProject,
    projects,
}: CatalogProps) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [modalOpen, setModalOpen] = useState(false);

    const filtered = useMemo(() => {
        const tab = tabs.find((t) => t.id === activeTab);
        if (!tab || tab.technology === null) return projects;
        return projects.filter((p) => p.technology === tab.technology);
    }, [activeTab, projects, tabs]);

    return (
        <section className={styles.section}>
            <Container>
                <header className={styles.head}>
                    <div className={styles.headLeft}>
                        <span className={styles.eyebrow}>{eyebrow}</span>
                        <h2 className={styles.title}>
                            {title}
                            {titleAccent && (
                                <>
                                    {" "}
                                    <span className={styles.titleAccent}>
                                        {titleAccent}
                                    </span>
                                </>
                            )}
                        </h2>
                    </div>
                    {lead && <p className={styles.lead}>{lead}</p>}
                </header>

                <div className={styles.tabs} role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filtered.length === 0 ? (
                        <p className={styles.empty}>
                            В этой категории пока нет проектов.
                        </p>
                    ) : (
                        filtered
                            .slice(0, 6)
                            .map((project) => (
                                <ProductCard
                                    key={project.slug}
                                    project={project}
                                />
                            ))
                    )}
                </div>

                <div className={styles.footer}>
                    <p className={styles.footerHint}>
                        {customProject.text}{" "}
                        <button
                            type="button"
                            className={styles.footerHintBtn}
                            onClick={() => setModalOpen(true)}
                        >
                            {customProject.linkLabel}
                        </button>
                    </p>
                    <Link href={cta.href} className={styles.cta}>
                        {cta.label}
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
