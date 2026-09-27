import type { ReactNode } from "react";
import {
    CONSTRUCTION_FORM_HEADING,
    CONSTRUCTION_FORM_LEAD,
} from "@/lib/copy";
import type { TechFamily } from "@/lib/techFamily";
import styles from "./lead.module.css";

export function ConstructionHubLead({
    family,
    form,
}: {
    family: TechFamily;
    form: ReactNode;
}) {
    return (
        <section id="lead" data-section="construction-lead" className={styles.root}>
            <h2 className={styles.title}>{CONSTRUCTION_FORM_HEADING[family]}</h2>
            <p className={styles.lead}>{CONSTRUCTION_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}
