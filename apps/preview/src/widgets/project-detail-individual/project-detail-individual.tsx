import { DETAIL_LIKED_HOUSE, DETAIL_LIKED_LEAD } from "@/lib/copy";
import { ProjectDetailIndividualHero } from "./__hero/project-detail-individual__hero";
import { ProjectDetailIndividualAbout } from "./__about/project-detail-individual__about";
import { ProjectDetailIndividualGallery } from "./__gallery/project-detail-individual__gallery";
import { ProjectDetailIndividualDrawings } from "./__drawings/project-detail-individual__drawings";
import { ProjectDetailIndividualOther } from "./__other/project-detail-individual__other";
import { ProjectDetailIndividualLayoutCta } from "./__layout-cta/project-detail-individual__layout-cta";
import { ProjectDetailIndividualSeeAlso } from "./__see-also/project-detail-individual__see-also";
import { uniqueSeeAlso } from "@/lib/uniqueSeeAlso";
import { routes } from "@/lib/routes";
import type { ProjectDetailIndividualProps } from "./project-detail-individual.types";
import layout from "../project-detail/project-detail.module.css";
import styles from "./project-detail-individual.module.css";

export function ProjectDetailIndividual({
    project,
    showcase,
    architectWorks,
    architectMore,
    leadForm,
}: ProjectDetailIndividualProps) {
    const images = showcase.gallery.length
        ? showcase.gallery
        : project.renders;
    const gallery = images.slice(1);
    const seeAlso = uniqueSeeAlso(project);

    return (
        <main className={layout.main}>
            <div className={styles.promo}>
                <ProjectDetailIndividualHero
                    project={project}
                    images={images}
                    className={styles.promoHero}
                />
                <ProjectDetailIndividualAbout
                    about={showcase.about}
                    portfolioHref={routes.projects({
                        kind:
                            project.projectClass === "bath"
                                ? "bath"
                                : "individual",
                    })}
                    className={styles.promoAbout}
                />
            </div>

            <ProjectDetailIndividualGallery
                images={gallery}
                name={project.displayName}
            />

            <ProjectDetailIndividualDrawings
                plans={showcase.plans ?? []}
                facades={showcase.facades ?? []}
                sections={showcase.sectionDrawings ?? []}
                fallbackArea={project.area}
            />

            <ProjectDetailIndividualLayoutCta
                source={`project-${project.slug}-layout`}
                prefill={`Изменить планировку: ${project.displayName}`}
            />

            <ProjectDetailIndividualOther
                project={project}
                works={architectWorks}
                moreCount={architectMore}
            />

            <ProjectDetailIndividualSeeAlso links={seeAlso} />

            <section
                id="detail-lead"
                data-section="detail-lead"
                className={styles.lead}
            >
                <div className={styles.leadBox}>
                    <div className={styles.leadHead}>
                        <h2 className={styles.leadTitle}>{DETAIL_LIKED_HOUSE}</h2>
                        <p className={styles.leadText}>{DETAIL_LIKED_LEAD}</p>
                    </div>
                    {leadForm}
                </div>
            </section>
        </main>
    );
}
