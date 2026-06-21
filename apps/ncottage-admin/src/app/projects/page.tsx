import Link from "next/link";
import type { Project } from "@forge/shared";
import { apiGet } from "@/lib/api";
import { deleteProject } from "./actions";

export const dynamic = "force-dynamic";

const priceFormatter = new Intl.NumberFormat("ru-RU");

export default async function ProjectsPage() {
    const projects = await apiGet<Project[]>("/projects");

    return (
        <div className="legacy-page">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                }}
            >
                <h1 style={{ margin: 0 }}>Проекты ({projects.length})</h1>
                <Link href="/projects/new" className="btn">
                    + Новый проект
                </Link>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Slug</th>
                        <th>Технология</th>
                        <th>Площадь</th>
                        <th>Цена</th>
                        <th>На главной</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.slug}>
                            <td>{project.name}</td>
                            <td>{project.slug}</td>
                            <td>{project.technology}</td>
                            <td>{project.area} м²</td>
                            <td>{priceFormatter.format(project.price)} ₽</td>
                            <td>{project.featured ? "да" : "—"}</td>
                            <td>
                                <div className="row-actions">
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="btn secondary"
                                    >
                                        Изменить
                                    </Link>
                                    <form action={deleteProject}>
                                        <input
                                            type="hidden"
                                            name="slug"
                                            value={project.slug}
                                        />
                                        <button
                                            type="submit"
                                            className="danger"
                                        >
                                            Удалить
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
