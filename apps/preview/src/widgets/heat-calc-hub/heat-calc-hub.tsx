import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { DETAIL_CALC_TITLE, NAV_BUILD } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { HeatCalcHubHero } from "./__hero/heat-calc-hub__hero";
import type { HeatCalcHubProps } from "./heat-calc-hub.types";
import styles from "./heat-calc-hub.module.css";

export function HeatCalcHub({ form }: HeatCalcHubProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_BUILD, href: routes.technology },
                        { label: DETAIL_CALC_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <HeatCalcHubHero />
                {form}
            </Container>
        </main>
    );
}
