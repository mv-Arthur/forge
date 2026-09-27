import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { EMPTY_HOUSES, NAV_WORKS, WORKS_HEADING } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { WorksCatalogItem } from "./__item/works-catalog__item";
import type { WorksCatalogProps } from "./works-catalog.types";
import styles from "./works-catalog.module.css";

export function WorksCatalog({
    objects,
    filters,
    extraFilter,
    lightbox,
    onOpen,
}: WorksCatalogProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_WORKS, href: routes.works },
                        { label: WORKS_HEADING },
                    ]}
                />
            </Container>
            <section data-section="works-header" className={styles.header}>
                <Container className={styles.headerInner}>
                    <h1 className={styles.title}>{WORKS_HEADING}</h1>
                    {filters}
                    {extraFilter}
                </Container>
            </section>
            <section data-section="works-grid" className={styles.gridSection}>
                <Container className={styles.gridInner}>
                    {objects.length > 0 ? (
                        <div className={styles.grid}>
                            {objects.map((object) => (
                                <WorksCatalogItem
                                    key={object.slug}
                                    object={object}
                                    onOpen={onOpen}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className={styles.empty}>{EMPTY_HOUSES}</p>
                    )}
                </Container>
            </section>
            {lightbox}
        </main>
    );
}
