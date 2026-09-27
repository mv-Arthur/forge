import type { ReactNode } from "react";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_WORKS } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { WorksHubHero } from "./__hero/works-hub__hero";
import { WorksHubLead } from "./__lead/works-hub__lead";
import { WorksHubMap } from "./__map/works-hub__map";
import { WorksHubStages } from "./__stages/works-hub__stages";
import type { WorksHubPayload } from "./works-hub.types";
import styles from "./works-hub.module.css";

export function WorksHub({
    payload,
    form,
}: {
    payload: WorksHubPayload;
    form: ReactNode;
}) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_WORKS, href: routes.works },
                        { label: payload.crumbCurrent },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <h1 className={styles.heading}>{payload.heading}</h1>
                <WorksHubHero
                    image={payload.hero.image}
                    href={payload.hero.href}
                    label={payload.hero.label}
                />
                <WorksHubStages
                    heading={payload.stagesHeading}
                    stages={payload.stages}
                    seeLabel={payload.stagesSeeLabel}
                    seeHref={payload.stagesSeeHref}
                />
                <WorksHubMap
                    heading={payload.mapHeading}
                    workTypes={payload.workTypes}
                    points={payload.mapPoints}
                />
                <WorksHubLead
                    heading={payload.visitHeading}
                    lead={payload.visitLead}
                    form={form}
                />
            </Container>
        </main>
    );
}
