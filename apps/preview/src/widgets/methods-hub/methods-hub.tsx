import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_BUILD, TECH_SECTION_HEADING } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { MethodsHubCard } from "./__card/methods-hub__card";
import { MethodsHubHero } from "./__hero/methods-hub__hero";
import type { MethodsHubPayload } from "./methods-hub.types";
import styles from "./methods-hub.module.css";

export function MethodsHub({ payload }: { payload: MethodsHubPayload }) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_BUILD, href: routes.technology },
                        { label: TECH_SECTION_HEADING },
                    ]}
                />
            </Container>
            <Container className={styles.page} data-section="methods-hub">
                <MethodsHubHero heading={payload.heading} lead={payload.lead} />
                <section data-section="methods-cards" className={styles.grid}>
                    {payload.cards.map((card, i) => (
                        <MethodsHubCard
                            key={card.tech}
                            card={card}
                            moreLabel={payload.moreLabel}
                            priority={i < 3}
                        />
                    ))}
                </section>
            </Container>
        </main>
    );
}
