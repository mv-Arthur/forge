import type { ReactNode } from "react";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import {
    EMPTY_HOUSES,
    NAV_WORKS,
    WORKS_EYEBROW,
    WORKS_HEADING,
    WORKS_LEAD,
} from "@/lib/copy";
import { BuiltObjectCard } from "@/widgets/built-object-card/built-object-card";
import type { EnrichedBuiltObject } from "@/types/catalog";
import styles from "./works-catalog.module.css";

export function WorksCatalog({
    objects,
    visit,
}: {
    objects: EnrichedBuiltObject[];
    visit: ReactNode;
}) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: "/" },
                        { label: NAV_WORKS },
                    ]}
                />
            </Container>
            <section data-section="works-header" className={styles.header}>
                <Container className={styles.headerInner}>
                    <div className={styles.headerRow}>
                        <div className={styles.copy}>
                            <div className={`eyebrow ${styles.eyebrow}`}>
                                {WORKS_EYEBROW}
                            </div>
                            <h1 className={styles.title}>{WORKS_HEADING}</h1>
                            <p className={styles.lead}>{WORKS_LEAD}</p>
                        </div>
                        <div className={styles.visit}>{visit}</div>
                    </div>
                </Container>
            </section>

            <section data-section="works-grid" className={styles.gridSection}>
                <Container className={styles.gridInner}>
                    {objects.length > 0 ? (
                        <div className={styles.grid}>
                            {objects.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                    ) : (
                        <p className={styles.empty}>{EMPTY_HOUSES}</p>
                    )}
                </Container>
            </section>
        </main>
    );
}
