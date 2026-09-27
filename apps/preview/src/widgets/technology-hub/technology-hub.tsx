import type { ReactNode } from "react";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { routes } from "@/lib/routes";
import { TechnologyHubArticles } from "./__articles/technology-hub__articles";
import { TechnologyHubCalc } from "./__calc/technology-hub__calc";
import { TechnologyHubFaq } from "./__faq/technology-hub__faq";
import { TechnologyHubHero } from "./__hero/technology-hub__hero";
import { TechnologyHubStages } from "./__stages/technology-hub__stages";
import { TechnologyHubTechs } from "./__techs/technology-hub__techs";
import type {
    TechnologyHubArticle,
    TechnologyHubPayload,
} from "./technology-hub.types";
import styles from "./technology-hub.module.css";

export function TechnologyHub({
    payload,
    articles,
    form,
}: {
    payload: TechnologyHubPayload;
    articles: TechnologyHubArticle[];
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
            <Container className={styles.page} data-section="technology-hub">
                <TechnologyHubHero
                    heading={payload.heading}
                    lead={payload.lead}
                />
                <TechnologyHubTechs
                    heading={payload.techsHeading}
                    cards={payload.techs}
                />
                <TechnologyHubStages
                    heading={payload.stagesHeading}
                    columns={payload.stages}
                />
                <TechnologyHubArticles
                    heading={payload.articlesHeading}
                    items={articles}
                />
                <TechnologyHubCalc
                    heading={payload.calcHeading}
                    lead={payload.calcLead}
                    cta={payload.calcCta}
                    envelope={payload.calcEnvelope}
                    projectName={payload.calcProjectName}
                />
                <TechnologyHubFaq
                    heading={payload.faqHeading}
                    items={payload.faq}
                />
                <section
                    id="lead"
                    data-section="technology-lead"
                    className={styles.leadBox}
                >
                    <h2 className={styles.leadTitle}>{payload.leadHeading}</h2>
                    <p className={styles.leadText}>{payload.leadText}</p>
                    <div className={styles.leadForm}>{form}</div>
                </section>
            </Container>
        </main>
    );
}
