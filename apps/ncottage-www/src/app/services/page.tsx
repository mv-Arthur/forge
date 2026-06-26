import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import {
    getServiceScenarios,
    getServices,
    getServicesUi,
} from "@/data/services";
import { ServicesNavigator } from "./ServicesNavigator";
import styles from "./services.module.css";

export const metadata: Metadata = {
    title: "Услуги — проектирование и строительство домов | Новый Коттедж",
    description:
        "Услуги компании Новый Коттедж: проектирование, строительство домов, фундаменты, бани, коммерческая недвижимость, отделка, благоустройство, инженерные сети и демонтаж.",
    alternates: { canonical: "/services" },
};

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
