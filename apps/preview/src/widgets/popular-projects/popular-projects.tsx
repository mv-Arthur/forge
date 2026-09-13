import Link from "next/link";
import { PillTabs } from "@/ui/pill-tabs";
import type {
    PopularProjectsViewProps,
    PopularTab,
} from "./popular-projects.types";
import styles from "./popular-projects.module.css";

function AllArrow() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M5 12h12.5M13.5 6.5L20 12l-6.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function PopularProjects({
    tab,
    onTab,
    hasIndividual,
    heading,
    lead,
    allHref,
    allLabel,
    serialLabel,
    individualLabel,
    cards,
}: PopularProjectsViewProps) {
    return (
        <section data-section="popular" className="section bg-ink-50/50">
            <div className="container-page">
                <div className={styles.header}>
                    <h2 className={styles.title}>{heading}</h2>
                    <Link href={allHref} className={styles.all}>
                        {allLabel}
                        <AllArrow />
                    </Link>
                </div>
                <div className={styles.toolbar}>
                    {hasIndividual ? (
                        <PillTabs
                            items={[
                                { id: "serial", label: serialLabel },
                                { id: "individual", label: individualLabel },
                            ]}
                            value={tab}
                            onChange={(id) => onTab(id as PopularTab)}
                        />
                    ) : null}
                    <p className={styles.lead}>{lead}</p>
                </div>
                <div className={styles.grid}>{cards}</div>
            </div>
        </section>
    );
}
