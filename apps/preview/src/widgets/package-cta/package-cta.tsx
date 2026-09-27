import { ChevronRightIcon } from "@/ui/icons";
import { DETAIL_PACKAGE_CTA } from "@/lib/copy";
import styles from "./package-cta.module.css";

export function PackageCta({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" className={styles.btn} onClick={onClick}>
            {DETAIL_PACKAGE_CTA}
            <span className={styles.icon} aria-hidden>
                <ChevronRightIcon />
            </span>
        </button>
    );
}
