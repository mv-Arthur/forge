import { listCatalogProjects } from "@/actions/catalog/list-projects";
import { projectIsIndividual } from "@/lib/catalogFilter";
import { PLANNING_FORM_CTA, PLANNING_TITLE } from "@/lib/copy";
import { unwrapAction } from "@/types/action";
import { IndividualPlanning } from "@/widgets/individual-planning/individual-planning";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${PLANNING_TITLE} · Новый Коттедж`,
    description:
        "Индивидуальное проектирование загородных домов в СПб и Ленобласти. Проект и стройка в одном месте, смета в договоре.",
};

const ARCHIVE_LIMIT = 4;

export default async function IndividualPlanningPage() {
    const { projects: catalogProjects } = unwrapAction(
        await listCatalogProjects()
    );
    const projects = catalogProjects
        .filter(projectIsIndividual)
        .sort((a, b) => Number(b.detailFilled) - Number(a.detailFilled))
        .slice(0, ARCHIVE_LIMIT);

    return (
        <IndividualPlanning
            projects={projects}
            form={
                <LeadFormContainer
                    source="individual-planning"
                    prefill={PLANNING_TITLE}
                    ctaLabel={PLANNING_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
