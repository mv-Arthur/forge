import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { ENGINEERING_EXTERNAL_TITLE, ENGINEERING_HUB_TITLE, NAV_SERVICES } from "@/lib/copy";
import { ENGINEERING_HUB_HREF } from "@/lib/engineering";
import { routes } from "@/lib/routes";
import { EngineeringExternalHero } from "./__hero/engineering-external__hero";
import { EngineeringExternalIncluded } from "./__included/engineering-external__included";
import { EngineeringExternalLead } from "./__lead/engineering-external__lead";
import { EngineeringExternalPrinciples } from "./__principles/engineering-external__principles";
import { EngineeringExternalServices } from "./__services/engineering-external__services";
import { EngineeringExternalWhen } from "./__when/engineering-external__when";
import { EngineeringExternalWhy } from "./__why/engineering-external__why";
import type { EngineeringExternalProps } from "./engineering-external.types";
import styles from "./engineering-external.module.css";

export function EngineeringExternal({ stats, form }: EngineeringExternalProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_SERVICES, href: routes.services },
                        {
                            label: ENGINEERING_HUB_TITLE,
                            href: ENGINEERING_HUB_HREF,
                        },
                        { label: ENGINEERING_EXTERNAL_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <EngineeringExternalHero />
                <EngineeringExternalWhen />
                <EngineeringExternalServices />
                <EngineeringExternalIncluded />
                <EngineeringExternalPrinciples />
                <EngineeringExternalWhy stats={stats} />
                <EngineeringExternalLead form={form} />
            </Container>
        </main>
    );
}
