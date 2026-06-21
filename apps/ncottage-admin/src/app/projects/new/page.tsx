import { createProject } from "../actions";
import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
    return (
        <>
            <h1>Новый проект</h1>
            <ProjectForm action={createProject} submitLabel="Создать" />
        </>
    );
}
