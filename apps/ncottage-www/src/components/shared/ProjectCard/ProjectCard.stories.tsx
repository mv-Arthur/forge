import type { Meta, StoryObj } from "@storybook/react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types/project";

const mockProject: Project = {
    slug: "nord",
    name: "Норд",
    technology: "gas-concrete",
    area: 156,
    floors: 2,
    bedrooms: 4,
    bathrooms: 2,
    price: 4850000,
    image: "/images/projects/nord.jpg",
    images: ["/images/projects/nord.jpg"],
    description: "Современный двухэтажный дом из газобетона.",
    specs: {
        dimensions: "10x13",
        roofType: "Двускатная",
        foundation: "Ленточный",
        wallMaterial: "Газобетон D400",
        buildTime: "4-5 месяцев",
    },
    featured: true,
};

const meta: Meta<typeof ProjectCard> = {
    title: "Shared/ProjectCard",
    component: ProjectCard,
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 360 }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
    args: { project: mockProject },
};

export const OneFloor: Story = {
    args: {
        project: {
            ...mockProject,
            slug: "eliot",
            name: "Элиот",
            floors: 1,
            bedrooms: 3,
            area: 120,
            price: 3200000,
            image: "/images/projects/eliot.jpg",
            specs: { ...mockProject.specs, dimensions: "10x12" },
        },
    },
};
