import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { FACADE_TITLE, NAV_SERVICES } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { FinishingFacadeCombo } from "./__combo/finishing-facade__combo";
import { FinishingFacadeHero } from "./__hero/finishing-facade__hero";
import { FinishingFacadeLead } from "./__lead/finishing-facade__lead";
import { FinishingFacadeMaterials } from "./__materials/finishing-facade__materials";
import type { FinishingFacadeProps } from "./finishing-facade.types";
import styles from "./finishing-facade.module.css";

export function FinishingFacade({ form }: FinishingFacadeProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_SERVICES, href: routes.services },
                        { label: FACADE_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <FinishingFacadeHero />
                <FinishingFacadeMaterials />
                <FinishingFacadeCombo />
                <FinishingFacadeLead form={form} />
            </Container>
        </main>
    );
}
