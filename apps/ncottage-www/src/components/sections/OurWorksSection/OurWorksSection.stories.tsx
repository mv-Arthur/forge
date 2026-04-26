import type { Meta, StoryObj } from "@storybook/react";
import { OUR_WORKS_SECTION } from "@/lib/constants";
import { getBuiltObjects } from "@/lib/data";
import { OurWorksSection } from "./OurWorksSection";

const meta: Meta<typeof OurWorksSection> = {
    title: "Sections/OurWorksSection",
    component: OurWorksSection,
    parameters: { layout: "fullscreen" },
    args: {
        title: OUR_WORKS_SECTION.title,
        tabs: OUR_WORKS_SECTION.tabs,
        cta: OUR_WORKS_SECTION.cta,
        objects: getBuiltObjects(),
    },
};

export default meta;
type Story = StoryObj<typeof OurWorksSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
