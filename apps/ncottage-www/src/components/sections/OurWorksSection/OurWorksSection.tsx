import Link from "next/link";
import type {
    OurWorksSectionContent,
    OurWorksSectionTab,
} from "@/lib/constants";
import type { BuiltObject } from "@/types/common";
import styles from "./OurWorksSection.module.css";

interface OurWorksSectionProps {
    title: OurWorksSectionContent["title"];
    tabs: OurWorksSectionContent["tabs"];
    cta: OurWorksSectionContent["cta"];
    objects: BuiltObject[];
}

export function OurWorksSection({
    title,
    tabs,
    cta,
    objects,
}: OurWorksSectionProps) {
    function renderTab(tab: OurWorksSectionTab, index: number) {
        const isActive = index === 0;
        const className = isActive
            ? `${styles.tab} ${styles.tabActive}`
            : styles.tab;
        if (tab.href) {
            return (
                <Link key={tab.id} href={tab.href} className={className}>
                    {tab.label}
                </Link>
            );
        }
        return (
            <span key={tab.id} className={className}>
                {tab.label}
            </span>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.tabs}>{tabs.map(renderTab)}</div>
            </div>
            <div className={styles.carousel}>
                {objects.map((obj) => (
                    <Link
                        key={obj.id}
                        href={obj.href}
                        className={styles.card}
                    >
                        <img
                            src={obj.image}
                            alt={obj.title}
                            className={styles.image}
                            decoding="async"
                        />
                        <h3 className={styles.cardTitle}>{obj.title}</h3>
                    </Link>
                ))}
            </div>
            <div className={styles.more}>
                <Link href={cta.href} className={styles.moreButton}>
                    {cta.label}
                </Link>
            </div>
        </section>
    );
}
