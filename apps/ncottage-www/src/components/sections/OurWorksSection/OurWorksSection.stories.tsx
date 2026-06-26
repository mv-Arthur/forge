import type { Meta, StoryObj } from "@storybook/react";
import { OUR_WORKS_SECTION } from "@/data/pages/home";
import builtObjectsData from "@/data/built-objects.json";
import type { BuiltObject } from "@/domain/project";
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
        objects: builtObjectsData as BuiltObject[],
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
