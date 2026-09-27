import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { BUILD_SUPPORT_TITLE, NAV_BUILD } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { BuildSupportAftercare } from "./__aftercare/build-support__aftercare";
import { BuildSupportCabinet } from "./__cabinet/build-support__cabinet";
import { BuildSupportHero } from "./__hero/build-support__hero";
import { BuildSupportLead } from "./__lead/build-support__lead";
import { BuildSupportManager } from "./__manager/build-support__manager";
import { BuildSupportMedia } from "./__media/build-support__media";
import { BuildSupportPlanning } from "./__planning/build-support__planning";
import { BuildSupportQuality } from "./__quality/build-support__quality";
import type { BuildSupportProps } from "./build-support.types";
import styles from "./build-support.module.css";

export function BuildSupport({ form }: BuildSupportProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_BUILD, href: routes.technology },
                        { label: BUILD_SUPPORT_TITLE },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <BuildSupportHero />
                <BuildSupportManager />
                <BuildSupportQuality />
                <BuildSupportCabinet />
                <BuildSupportMedia />
                <BuildSupportAftercare />
                <BuildSupportPlanning />
                <BuildSupportLead form={form} />
            </Container>
        </main>
    );
}
