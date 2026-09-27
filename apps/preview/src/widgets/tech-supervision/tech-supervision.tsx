import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_BUILD, TECH_SUPERVISION_TITLE } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { TechSupervisionAcceptance } from "./__acceptance/tech-supervision__acceptance";
import { TechSupervisionDiffer } from "./__differ/tech-supervision__differ";
import { TechSupervisionHero } from "./__hero/tech-supervision__hero";
import { TechSupervisionLead } from "./__lead/tech-supervision__lead";
import { TechSupervisionPartners } from "./__partners/tech-supervision__partners";
import { TechSupervisionWhy } from "./__why/tech-supervision__why";
import type { TechSupervisionProps } from "./tech-supervision.types";
import styles from "./tech-supervision.module.css";

export function TechSupervision({ form }: TechSupervisionProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_BUILD, href: routes.technology },
                        { label: TECH_SUPERVISION_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <TechSupervisionHero />
                <TechSupervisionWhy />
                <TechSupervisionDiffer />
                <TechSupervisionPartners />
                <TechSupervisionAcceptance />
                <TechSupervisionLead form={form} />
            </Container>
        </main>
    );
}
