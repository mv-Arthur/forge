import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "./ProductCard";
import { PROJECTS } from "@/data/projects";

const meta: Meta<typeof ProductCard> = {
    title: "Shared/ProductCard",
    component: ProductCard,
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 360 }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Grid: Story = {
    args: { project: PROJECTS[0], variant: "grid" },
};

export const List: Story = {
    args: { project: PROJECTS[0], variant: "list" },
    decorators: [
        (Story) => (
            <div style={{ width: 800 }}>
                <Story />
            </div>
        ),
    ],
};

export const Premium: Story = {
    args: {
        project: PROJECTS.find((p) => p.slug === "karl") ?? PROJECTS[0],
        variant: "grid",
    },
};
