import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_SERVICES } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { ConstructionHubBenefits } from "./__benefits/construction-hub__benefits";
import { ConstructionHubHero } from "./__hero/construction-hub__hero";
import { ConstructionHubIndividual } from "./__individual/construction-hub__individual";
import { ConstructionHubLead } from "./__lead/construction-hub__lead";
import { ConstructionHubLines } from "./__lines/construction-hub__lines";
import { ConstructionHubSerial } from "./__serial/construction-hub__serial";
import { ConstructionHubStages } from "./__stages/construction-hub__stages";
import { ConstructionHubTechs } from "./__techs/construction-hub__techs";
import type { ConstructionHubProps } from "./construction-hub.types";
import styles from "./construction-hub.module.css";

export function ConstructionHub({
    payload,
    serial,
    form,
}: ConstructionHubProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_SERVICES, href: routes.services },
                        { label: payload.crumb },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <ConstructionHubHero payload={payload} />
                <ConstructionHubBenefits family={payload.family} />
                <ConstructionHubTechs techs={payload.techs} />
                <ConstructionHubStages
                    family={payload.family}
                    href={payload.stagesHref}
                />
                {payload.serial.length > 0 ? (
                    <ConstructionHubSerial
                        family={payload.family}
                        allHref={payload.serialAllHref}
                        carousel={serial}
                    />
                ) : null}
                <ConstructionHubLines
                    family={payload.family}
                    lines={payload.lines}
                />
                <ConstructionHubIndividual
                    family={payload.family}
                    projects={payload.individual}
                    allHref={payload.individualAllHref}
                />
                <ConstructionHubLead family={payload.family} form={form} />
            </Container>
        </main>
    );
}
