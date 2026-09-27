import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_SERVICES, PLANNING_TITLE } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { IndividualPlanningArchive } from "./__archive/individual-planning__archive";
import { IndividualPlanningBenefits } from "./__benefits/individual-planning__benefits";
import { IndividualPlanningHero } from "./__hero/individual-planning__hero";
import { IndividualPlanningLead } from "./__lead/individual-planning__lead";
import { IndividualPlanningNote } from "./__note/individual-planning__note";
import { IndividualPlanningSteps } from "./__steps/individual-planning__steps";
import type { IndividualPlanningProps } from "./individual-planning.types";
import styles from "./individual-planning.module.css";

export function IndividualPlanning({
    projects,
    form,
}: IndividualPlanningProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_SERVICES, href: routes.services },
                        { label: PLANNING_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <IndividualPlanningHero />
                <IndividualPlanningBenefits />
                <IndividualPlanningArchive projects={projects} />
                <IndividualPlanningNote />
                <IndividualPlanningSteps />
                <IndividualPlanningLead form={form} />
            </Container>
        </main>
    );
}
