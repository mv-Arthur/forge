import type { ReactNode } from "react";
import { Breadcrumb } from "@/ui/breadcrumb";

export function ProjectsCatalog({ filters }: { filters: ReactNode }) {
    return (
        <main>
            <section
                data-section="catalog-header"
                className="bg-white"
            >
                <div className="container-page">
                    <h1 className="sr-only">Проекты</h1>
                    <Breadcrumb
                        items={[
                            { label: "Главная", href: "/" },
                            { label: "Проекты" },
                        ]}
                    />
                </div>
            </section>

            <section
                data-section="catalog-grid"
                id="catalog"
                className="bg-white pb-10"
            >
                <div className="container-page pt-8">{filters}</div>
            </section>
        </main>
    );
}
