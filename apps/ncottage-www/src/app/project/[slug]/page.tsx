import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
    ProjectAbout,
    ProjectAnchorNav,
    ProjectCalculator,
    ProjectConfigProvider,
    ProjectFaq,
    ProjectFloorPlans,
    ProjectGallery,
    ProjectLeadForm,
    ProjectMobileBar,
    ProjectMortgage,
    ProjectQuickStats,
    ProjectShowroom,
    ProjectSpecsGrid,
    ProjectStickyAside,
    SimilarProjects,
    pickSimilarProjects,
} from "@/components/features/project-detail";
import { getBuiltObjects } from "@/data/built-objects";
import { getProjectBySlug, getProjects } from "@/data/projects";
import {
    PROJECT_HUB_CATEGORIES,
    PROJECT_TECHNOLOGY_LABELS,
} from "@/domain/technology";
import { formatArea } from "@/lib/utils";
import styles from "./page.module.css";

interface Props {
    params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) return { title: "Проект не найден" };
    return {
        title: `${project.name} — проект дома ${formatArea(project.area)} | Новый Коттедж`,
        description: project.description,
    };
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) notFound();

    const technologyCategory = PROJECT_HUB_CATEGORIES.find(
        (c) => c.technology === project.technology
    );
    const allProjects = await getProjects();
    const similar = pickSimilarProjects(allProjects, project, 3);
    const builtObjects = getBuiltObjects();
    const showroomObjects = project.relatedObjectIds
        ? builtObjects.filter((o) => project.relatedObjectIds!.includes(o.id))
        : [];

    const galleryImages =
        project.images.length > 0 ? project.images : [project.image];

    const anchors = [
        { id: "overview", label: "О проекте" },
        ...(project.floorPlans ? [{ id: "plans", label: "Планировки" }] : []),
        { id: "specs", label: "Характеристики" },
        ...(project.packages
            ? [{ id: "packages", label: "Комплектации" }]
            : []),
        ...(showroomObjects.length > 0
            ? [{ id: "showroom", label: "Построенные" }]
            : []),
        { id: "faq", label: "Вопросы" },
        ...(similar.length > 0 ? [{ id: "similar", label: "Похожие" }] : []),
    ];

    return (
        <ProjectConfigProvider>
            <article className={styles.page}>
                <Container>
                    <Breadcrumbs
                        items={[
                            { label: "Главная", href: "/" },
                            { label: "Наши проекты", href: "/projects" },
                            ...(technologyCategory
                                ? [
                                      {
                                          label: technologyCategory.title,
                                          href: `/projects/${technologyCategory.slug}`,
                                      },
                                  ]
                                : []),
                            { label: project.name },
                        ]}
                    />

                    <header className={styles.headBlock}>
                        <p className={styles.eyebrow}>
                            {PROJECT_TECHNOLOGY_LABELS[project.technology]} ·{" "}
                            {project.specs.dimensions} м
                        </p>
                        <h1 className={styles.title}>
                            Проект{" "}
                            <span className={styles.titleAccent}>
                                «{project.name}»
                            </span>
                        </h1>
                    </header>

                    <ProjectGallery
                        images={galleryImages}
                        alt={`Проект «${project.name}»`}
                    />
                </Container>

                <div className={styles.anchorWrap}>
                    <Container>
                        <ProjectAnchorNav items={anchors} />
                    </Container>
                </div>

                <Container>
                    <div className={styles.layout}>
                        <div className={styles.main}>
                            <section
                                id="overview"
                                className={styles.sectionFirst}
                            >
                                <ProjectQuickStats project={project} />
                                <div className={styles.aboutWrap}>
                                    <ProjectAbout project={project} />
                                </div>
                            </section>

                            {project.floorPlans && (
                                <section id="plans" className={styles.section}>
                                    <SectionHeading
                                        title="Планировки"
                                        align="left"
                                        className={styles.sectionHead}
                                    />
                                    <ProjectFloorPlans
                                        plans={project.floorPlans}
                                    />
                                </section>
                            )}

                            <section id="specs" className={styles.section}>
                                <SectionHeading
                                    title="Характеристики"
                                    align="left"
                                    className={styles.sectionHead}
                                />
                                <ProjectSpecsGrid project={project} />
                            </section>

                            {project.packages && (
                                <section
                                    id="packages"
                                    className={styles.section}
                                >
                                    <SectionHeading
                                        title="Комплектации и расчёт"
                                        lead="Выберите комплектацию и опции — посчитаем ориентировочную стоимость прямо сейчас."
                                        align="left"
                                        className={styles.sectionHead}
                                    />
                                    <ProjectCalculator
                                        packages={project.packages}
                                        options={project.options}
                                    />
                                </section>
                            )}

                            <section className={styles.section}>
                                <ProjectMortgage price={project.price} />
                            </section>

                            {showroomObjects.length > 0 && (
                                <section
                                    id="showroom"
                                    className={styles.section}
                                >
                                    <SectionHeading
                                        title="Посмотреть вживую"
                                        lead="Похожие дома, которые мы построили — можно приехать и оценить качество."
                                        align="left"
                                        className={styles.sectionHead}
                                    />
                                    <ProjectShowroom
                                        objects={showroomObjects}
                                    />
                                </section>
                            )}

                            <section id="faq" className={styles.section}>
                                <SectionHeading
                                    title="Частые вопросы"
                                    align="left"
                                    className={styles.sectionHead}
                                />
                                <ProjectFaq />
                            </section>
                        </div>

                        <ProjectStickyAside project={project} />
                    </div>
                </Container>

                {similar.length > 0 && (
                    <section id="similar" className={styles.similar}>
                        <Container>
                            <SectionHeading
                                eyebrow="Похожие проекты"
                                title="Может подойти и это"
                                align="left"
                                className={styles.sectionHead}
                            />
                            <SimilarProjects projects={similar} />
                        </Container>
                    </section>
                )}

                <section id="lead" className={styles.lead}>
                    <Container>
                        <ProjectLeadForm
                            projectName={project.name}
                            projectPrice={project.price}
                        />
                    </Container>
                </section>

                <ProjectMobileBar project={project} />
            </article>
        </ProjectConfigProvider>
    );
}
