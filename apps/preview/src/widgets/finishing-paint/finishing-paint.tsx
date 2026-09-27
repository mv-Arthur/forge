import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_SERVICES, PAINT_TITLE } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { FinishingPaintApproach } from "./__approach/finishing-paint__approach";
import { FinishingPaintBenefits } from "./__benefits/finishing-paint__benefits";
import { FinishingPaintCoatings } from "./__coatings/finishing-paint__coatings";
import { FinishingPaintHero } from "./__hero/finishing-paint__hero";
import { FinishingPaintLead } from "./__lead/finishing-paint__lead";
import { FinishingPaintRisks } from "./__risks/finishing-paint__risks";
import { FinishingPaintSteps } from "./__steps/finishing-paint__steps";
import type { FinishingPaintProps } from "./finishing-paint.types";
import styles from "./finishing-paint.module.css";

export function FinishingPaint({ form }: FinishingPaintProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_SERVICES, href: routes.services },
                        { label: PAINT_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <FinishingPaintHero />
                <FinishingPaintBenefits />
                <FinishingPaintRisks />
                <FinishingPaintSteps />
                <FinishingPaintApproach />
                <FinishingPaintCoatings />
                <FinishingPaintLead form={form} />
            </Container>
        </main>
    );
}
