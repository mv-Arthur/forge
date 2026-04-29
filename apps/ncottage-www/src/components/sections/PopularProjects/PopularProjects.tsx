"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import type { PopularProjectsSectionContent } from "@/lib/constants";
import type { Project } from "@/types/project";
import { ProductCard } from "@/components/shared/ProductCard";
import styles from "./PopularProjects.module.css";

interface PopularProjectsProps {
    title: PopularProjectsSectionContent["title"];
    tabs: PopularProjectsSectionContent["tabs"];
    cta: PopularProjectsSectionContent["cta"];
    projects: Project[];
}

export function PopularProjects({
    title,
    tabs,
    cta,
    projects,
}: PopularProjectsProps) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const filtered = useMemo(() => {
        const tab = tabs.find((t) => t.id === activeTab);
        if (!tab || tab.technology === null) return projects;
        return projects.filter((p) => p.technology === tab.technology);
    }, [activeTab, projects, tabs]);

    return (
        <section className={styles.section}>
            <Container>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.tabs} role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={
                                activeTab === tab.id
                                    ? `${styles.tab} ${styles.tabActive}`
                                    : styles.tab
                            }
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {filtered.length === 0 ? (
                    <p className={styles.empty}>
                        В этой категории пока нет проектов.
                    </p>
                ) : (
                    <div className={styles.grid}>
                        {filtered.map((project) => (
                            <ProductCard
                                key={project.slug}
                                project={project}
                            />
                        ))}
                    </div>
                )}
                <div className={styles.more}>
                    <Link href={cta.href} className={styles.moreButton}>
                        {cta.label}
                    </Link>
                </div>
            </Container>
        </section>
    );
}
