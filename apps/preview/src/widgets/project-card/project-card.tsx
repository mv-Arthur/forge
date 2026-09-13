import { BATH_PROJECT_LABEL, INDIVIDUAL_PROJECT_LABEL } from "@/lib/copy";
import { projectClass } from "@/lib/catalogFilter";
import {
    bathroomsWord,
    bedroomsWord,
    formatArea,
    formatFloors,
    formatPrice,
    formatTechnologyBrand,
} from "@/lib/format";
import { ProjectCardShell } from "./__shell/project-card__shell";
import type { ProjectCardMetric, ProjectCardProps } from "./project-card.types";

function floorsChip(floors: string | null | undefined): string | null {
    if (floors == null) return null;
    const label = formatFloors(floors);
    return label === "—" ? null : label;
}

export function ProjectCard({
    project,
    object,
    priority = false,
    layout = "grid",
}: ProjectCardProps) {
    if (object) {
        const images = object.gallery.filter(Boolean).slice(0, 8);
        const hero = object.heroImage || images[0] || "";
        const techLabel = object.technology
            ? formatTechnologyBrand(object.technology)
            : null;
        const metrics: ProjectCardMetric[] = [];
        if (object.locationLabel) {
            metrics.push({ icon: "pin", label: object.locationLabel });
        }
        if (object.area != null) {
            metrics.push({ icon: "area", label: formatArea(object.area) });
        }
        if (object.bedrooms != null) {
            metrics.push({
                icon: "bed",
                label: `${object.bedrooms} ${bedroomsWord(object.bedrooms)}`,
            });
        }
        if (object.bathrooms != null) {
            metrics.push({
                icon: "bath",
                label: `${object.bathrooms} ${bathroomsWord(object.bathrooms)}`,
            });
        }

        return (
            <ProjectCardShell
                href={`/works/${object.slug}`}
                slug={object.slug}
                name={object.displayTitle}
                hero={hero}
                images={images}
                layout={layout}
                priority={priority}
                floorsLabel={floorsChip(object.floors)}
                techLabel={techLabel === "—" ? null : techLabel}
                priceKicker={null}
                price=""
                metrics={metrics}
            />
        );
    }

    const images = project.renders.slice(0, 8);
    const href = `/projects/${project.slug}`;
    const hero = project.heroImage || images[0] || "";
    const primaryTech =
        project.variants[0]?.technology ?? project.technologies[0] ?? null;
    const techLabel = primaryTech
        ? formatTechnologyBrand(primaryTech)
        : null;
    const similar = layout === "similar";
    const metrics: ProjectCardMetric[] = [];
    if (!similar && project.dimensions) {
        metrics.push({
            icon: "size",
            label: `${project.dimensions.replace(/[xх]/gi, "×")} м`,
        });
    }
    if (project.area != null) {
        metrics.push({ icon: "area", label: formatArea(project.area) });
    }
    if (project.bedrooms != null) {
        metrics.push({
            icon: "bed",
            label: `${project.bedrooms} ${bedroomsWord(project.bedrooms)}`,
        });
    }
    if (!similar && project.bathrooms != null) {
        metrics.push({
            icon: "bath",
            label: `${project.bathrooms} ${bathroomsWord(project.bathrooms)}`,
        });
    }

    const cls = projectClass(project);
    const kindLabel =
        cls === "bath"
            ? BATH_PROJECT_LABEL
            : cls === "individual"
              ? INDIVIDUAL_PROJECT_LABEL
              : floorsChip(project.floors);

    return (
        <ProjectCardShell
            href={href}
            slug={project.slug}
            name={project.displayName}
            hero={hero}
            images={images}
            layout={layout}
            priority={priority}
            floorsLabel={kindLabel}
            techLabel={techLabel === "—" ? null : techLabel}
            priceKicker={null}
            price={
                similar && !(project.priceFrom != null && project.priceFrom > 0)
                    ? ""
                    : formatPrice(project.priceFrom)
            }
            metrics={metrics}
            hit={project.detailFilled && !similar}
            stub={!project.detailFilled}
        />
    );
}
