import type { Meta, StoryObj } from "@storybook/react";
import { STAGES_SECTION } from "@/data/pages/home";
import { StagesSection } from "./StagesSection";

const meta: Meta<typeof StagesSection> = {
    title: "Sections/StagesSection",
    component: StagesSection,
    parameters: { layout: "fullscreen" },
    args: {
        title: STAGES_SECTION.title,
        stages: STAGES_SECTION.stages,
    },
};

export default meta;
type Story = StoryObj<typeof StagesSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
