import type { ReactNode } from "react";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { routes } from "@/lib/routes";
import { WorksStagesHubCardView } from "./__card/works-stages-hub__card";
import { WorksStagesHubVisit } from "./__visit/works-stages-hub__visit";
import type { WorksStagesHubPayload } from "./works-stages-hub.types";
import styles from "./works-stages-hub.module.css";

export function WorksStagesHub({
    payload,
    visitCta,
}: {
    payload: WorksStagesHubPayload;
    visitCta: ReactNode;
}) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: payload.crumbCurrent },
                    ]}
                />
            </Container>
            <Container className={styles.page} data-section="works-stages-hub">
                <h1 className={styles.heading}>{payload.heading}</h1>
                <div className={styles.grid}>
                    {payload.cards.map((card, i) => (
                        <WorksStagesHubCardView
                            key={card.id}
                            card={card}
                            priority={i === 0}
                        />
                    ))}
                </div>
                <WorksStagesHubVisit visit={payload.visit} cta={visitCta} />
            </Container>
        </main>
    );
}
