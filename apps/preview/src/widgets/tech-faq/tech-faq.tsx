import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_BUILD, TECH_FAQ_CRUMB } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { TechFaqHero } from "./__hero/tech-faq__hero";
import { TechFaqLead } from "./__lead/tech-faq__lead";
import { TechFaqList } from "./__list/tech-faq__list";
import { TECH_FAQ_ITEMS } from "./lib/content";
import type { TechFaqProps } from "./tech-faq.types";
import styles from "./tech-faq.module.css";

export function TechFaq({ form }: TechFaqProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_BUILD, href: routes.technology },
                        { label: TECH_FAQ_CRUMB },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <TechFaqHero />
                <TechFaqList items={TECH_FAQ_ITEMS} />
                <TechFaqLead form={form} />
            </Container>
        </main>
    );
}
