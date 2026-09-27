import Link from "next/link";
import { DETAIL_SEE_ALSO } from "@/lib/copy";
import type { SeeAlsoLink } from "@/lib/uniqueSeeAlso";
import { SeeAlsoGlyph } from "./see-also-icons";
import styles from "./individual-see-also.module.css";

export function ProjectDetailIndividualSeeAlso({
    links,
}: {
    links: SeeAlsoLink[];
}) {
    if (links.length === 0) return null;
    return (
        <section data-section="detail-see-also" className={styles.root}>
            <div className={styles.inner}>
                <h2 className={styles.title}>{DETAIL_SEE_ALSO}</h2>
                <ul className={styles.list}>
                    {links.map((link) => (
                        <li key={link.href} className={styles.item}>
                            <span className={styles.icon}>
                                <SeeAlsoGlyph name={link.icon} />
                            </span>
                            <Link href={link.href} className={styles.link}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
