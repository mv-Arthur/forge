import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "./ProductCard";
import { PROJECTS } from "@/lib/constants";

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

export const Default: Story = {
    args: { project: PROJECTS[0] },
};

export const OneFloor: Story = {
    args: { project: PROJECTS.find((p) => p.floors === 1) ?? PROJECTS[0] },
};

export const Premium: Story = {
    args: { project: PROJECTS.find((p) => p.slug === "karl") ?? PROJECTS[0] },
};
