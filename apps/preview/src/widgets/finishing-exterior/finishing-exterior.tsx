import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { EXTERIOR_TITLE, NAV_SERVICES } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { FinishingExteriorHero } from "./__hero/finishing-exterior__hero";
import { FinishingExteriorLead } from "./__lead/finishing-exterior__lead";
import { FinishingExteriorMethods } from "./__methods/finishing-exterior__methods";
import { FinishingExteriorPaintLink } from "./__paint-link/finishing-exterior__paint-link";
import { FinishingExteriorWhen } from "./__when/finishing-exterior__when";
import type { FinishingExteriorProps } from "./finishing-exterior.types";
import styles from "./finishing-exterior.module.css";

export function FinishingExterior({ form }: FinishingExteriorProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_SERVICES, href: routes.services },
                        { label: EXTERIOR_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <FinishingExteriorHero />
                <FinishingExteriorMethods />
                <FinishingExteriorWhen />
                <FinishingExteriorPaintLink />
                <FinishingExteriorLead form={form} />
            </Container>
        </main>
    );
}
