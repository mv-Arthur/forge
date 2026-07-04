import { PageHeader } from "@/components/page-header";
import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
    return (
        <div>
            <PageHeader
                title="Новый проект"
                description="Заполните карточку проекта"
            />
            <ProjectForm submitLabel="Создать" />
        </div>
    );
}
