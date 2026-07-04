import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import {
    getServiceScenarios,
    getServices,
    getServicesUi,
} from "@/data/services";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import { ServicesNavigator } from "./ServicesNavigator";
import styles from "./services.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["services"].title,
        description: seo.indexes["services"].description,
        path: "/services",
    });
}

export default async function ServicesPage() {
    const [services, scenarios, ui] = await Promise.all([
        getServices(),
        getServiceScenarios(),
        getServicesUi(),
    ]);

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Услуги" },
                    ]}
                />

                <ServicesNavigator
                    services={services}
                    scenarios={scenarios}
                    quiz={ui.quiz}
                    routeSteps={ui.routeSteps}
                    additionalLinks={ui.additionalLinks}
                />
            </Container>
        </section>
    );
}
