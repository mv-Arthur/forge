import type { ReactNode } from "react";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { routes } from "@/lib/routes";
import styles from "./projects-catalog.module.css";

export function ProjectsCatalog({ filters }: { filters: ReactNode }) {
    return (
        <main>
            <section data-section="catalog-header" className={styles.header}>
                <Container>
                    <h1 className="sr-only">Проекты</h1>
                    <Breadcrumb
                        items={[
                            { label: "Главная", href: routes.home },
                            { label: "Проекты" },
                        ]}
                    />
                </Container>
            </section>

            <section
                data-section="catalog-grid"
                id="catalog"
                className={styles.grid}
            >
                <Container className={styles.filters}>{filters}</Container>
            </section>
        </main>
    );
}
