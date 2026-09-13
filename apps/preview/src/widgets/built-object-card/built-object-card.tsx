import { ProjectCard } from "@/widgets/project-card/project-card";
import type { BuiltObjectCardProps } from "./built-object-card.types";

export function BuiltObjectCard({ object }: BuiltObjectCardProps) {
    return <ProjectCard object={object} layout="grid" />;
}
