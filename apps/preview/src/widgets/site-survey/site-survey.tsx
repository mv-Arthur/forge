import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_SERVICES, SITE_SURVEY_TITLE } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { SiteSurveyAudiences } from "./__audiences/site-survey__audiences";
import { SiteSurveyDeliverables } from "./__deliverables/site-survey__deliverables";
import { SiteSurveyHero } from "./__hero/site-survey__hero";
import { SiteSurveyLead } from "./__lead/site-survey__lead";
import { SiteSurveyOffer } from "./__offer/site-survey__offer";
import { SiteSurveyWho } from "./__who/site-survey__who";
import { SiteSurveyWhy } from "./__why/site-survey__why";
import type { SiteSurveyProps } from "./site-survey.types";
import styles from "./site-survey.module.css";

export function SiteSurvey({ form }: SiteSurveyProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_SERVICES, href: routes.services },
                        { label: SITE_SURVEY_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <SiteSurveyHero />
                <SiteSurveyAudiences />
                <SiteSurveyDeliverables />
                <SiteSurveyOffer />
                <SiteSurveyWho />
                <SiteSurveyWhy />
                <SiteSurveyLead form={form} />
            </Container>
        </main>
    );
}
