import type { Meta, StoryObj } from "@storybook/react";
import { OUR_WORKS_SECTION } from "@/content/home";
import { getBuiltObjects } from "@/data/built-objects";
import { OurWorksSection } from "./OurWorksSection";

const meta: Meta<typeof OurWorksSection> = {
    title: "Sections/OurWorksSection",
    component: OurWorksSection,
    parameters: { layout: "fullscreen" },
    args: {
        eyebrow: OUR_WORKS_SECTION.eyebrow,
        title: OUR_WORKS_SECTION.title,
        titleAccent: OUR_WORKS_SECTION.titleAccent,
        lead: OUR_WORKS_SECTION.lead,
        cta: OUR_WORKS_SECTION.cta,
        visitInvite: OUR_WORKS_SECTION.visitInvite,
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
