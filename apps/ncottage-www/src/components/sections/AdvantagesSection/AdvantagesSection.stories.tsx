import type { Meta, StoryObj } from "@storybook/react";
import { ADVANTAGES_SECTION } from "@/lib/constants";
import { AdvantagesSection } from "./AdvantagesSection";

const meta: Meta<typeof AdvantagesSection> = {
    title: "Sections/AdvantagesSection",
    component: AdvantagesSection,
    parameters: { layout: "fullscreen" },
    args: {
        title: ADVANTAGES_SECTION.title,
        text: ADVANTAGES_SECTION.text,
        background: ADVANTAGES_SECTION.background,
        items: ADVANTAGES_SECTION.items,
    },
};

export default meta;
type Story = StoryObj<typeof AdvantagesSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};

export const NoBackground: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
    args: {
        background: "",
    },
};
