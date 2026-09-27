import type { ReactNode } from "react";
import {
    BUILD_SUPPORT_FORM_HEADING,
    BUILD_SUPPORT_FORM_LEAD,
} from "@/lib/copy";
import styles from "./lead.module.css";

export function BuildSupportLead({ form }: { form: ReactNode }) {
    return (
        <section
            id="lead"
            data-section="build-support-lead"
            className={styles.root}
        >
            <h2 className={styles.title}>{BUILD_SUPPORT_FORM_HEADING}</h2>
            <p className={styles.lead}>{BUILD_SUPPORT_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}
