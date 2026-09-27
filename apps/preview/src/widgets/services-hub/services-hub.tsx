import type { ReactNode } from "react";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { routes } from "@/lib/routes";
import type { ServicesHubPayload } from "./services-hub.types";
import { ServicesHubHero } from "./__hero/services-hub__hero";
import { ServicesHubSituations } from "./__situations/services-hub__situations";
import { ServicesHubPath } from "./__path/services-hub__path";
import { ServicesHubStats } from "./__stats/services-hub__stats";
import { ServicesHubWorks } from "./__works/services-hub__works";
import styles from "./services-hub.module.css";

export function ServicesHub({
    payload,
    form,
}: {
    payload: ServicesHubPayload;
    form: ReactNode;
}) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: payload.crumb },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <ServicesHubHero
                    eyebrow={payload.eyebrow}
                    heading={payload.heading}
                    lead={payload.lead}
                    chooseLabel={payload.chooseLabel}
                    chooseHref={payload.chooseHref}
                    meetLabel={payload.meetLabel}
                    meetHref={payload.meetHref}
                    heroImage={payload.heroImage}
                />
                <ServicesHubSituations
                    heading={payload.situationsHeading}
                    lead={payload.situationsLead}
                    items={payload.situations}
                />
                <ServicesHubPath
                    heading={payload.pathHeading}
                    steps={payload.pathSteps}
                />
                <section
                    id="lead"
                    data-section="services-lead"
                    className={styles.lead}
                >
                    <h2 className={styles.leadTitle}>{payload.leadHeading}</h2>
                    <p className={styles.leadText}>{payload.leadText}</p>
                    <div className={styles.leadForm}>{form}</div>
                </section>
            </Container>
            <ServicesHubStats stats={payload.stats} />
            <Container className={styles.worksWrap}>
                <ServicesHubWorks cards={payload.works} />
            </Container>
        </main>
    );
}
