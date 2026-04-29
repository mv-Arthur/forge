import type { Meta, StoryObj } from "@storybook/react";
import { POPULAR_PROJECTS_SECTION } from "@/lib/constants";
import { getFeaturedProjects } from "@/lib/data";
import { PopularProjects } from "./PopularProjects";

const projects = getFeaturedProjects();

const meta: Meta<typeof PopularProjects> = {
    title: "Sections/PopularProjects",
    component: PopularProjects,
    parameters: { layout: "fullscreen" },
    args: {
        title: POPULAR_PROJECTS_SECTION.title,
        tabs: POPULAR_PROJECTS_SECTION.tabs,
        cta: POPULAR_PROJECTS_SECTION.cta,
        projects,
    },
};

export default meta;
type Story = StoryObj<typeof PopularProjects>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};

export const EmptyTab: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
    args: {
        projects: projects.filter((p) => p.technology === "gas-concrete"),
        tabs: POPULAR_PROJECTS_SECTION.tabs.map((tab) =>
            tab.id === "all" ? { ...tab, technology: "fachwerk" } : tab
        ),
    },
};
