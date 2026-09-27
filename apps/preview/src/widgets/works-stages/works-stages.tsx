import Link from "next/link";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { ChevronLeftIcon } from "@/ui/icons";
import { NAV_WORKS, WORKS_STAGES_BACK } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { isServiceSubsectionTitle } from "@/lib/worksStages";
import type { WorksStagesViewProps } from "./works-stages.types";
import styles from "./works-stages.module.css";

export function WorksStages({
    payload,
    menu,
    chips,
    secret,
    tags,
    gallery,
    lightbox,
}: WorksStagesViewProps) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_WORKS, href: routes.works },
                        {
                            label: isServiceSubsectionTitle(
                                payload.subsectionTitle,
                            )
                                ? payload.sectionTitle
                                : payload.subsectionTitle,
                        },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <div className={styles.layout} data-section="works-stage">
                    <aside className={styles.menu}>{menu}</aside>
                    <div className={styles.view}>
                        <div className={styles.mobileHead}>
                            <Link
                                href={routes.works}
                                className={styles.back}
                                aria-label={WORKS_STAGES_BACK}
                            >
                                <ChevronLeftIcon />
                            </Link>
                            <div className={styles.sectionName}>
                                {payload.sectionTitle}
                            </div>
                        </div>
                        <div className={styles.sectionNameDesktop}>
                            {payload.sectionTitle}
                        </div>
                        <div className={styles.toolbar}>
                            {chips}
                            {secret}
                        </div>
                        <div className={styles.tags}>{tags}</div>
                        {gallery}
                    </div>
                </div>
            </Container>
            {lightbox}
        </main>
    );
}
