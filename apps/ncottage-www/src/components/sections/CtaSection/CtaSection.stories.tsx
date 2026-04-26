import type { Meta, StoryObj } from "@storybook/react";
import { CTA_SECTION } from "@/lib/constants";
import { CtaSection } from "./CtaSection";

const meta: Meta<typeof CtaSection> = {
    title: "Sections/CtaSection",
    component: CtaSection,
    parameters: { layout: "fullscreen" },
    args: {
        title: CTA_SECTION.title,
        text: CTA_SECTION.text,
        buttonLabel: CTA_SECTION.buttonLabel,
        image: CTA_SECTION.image,
    },
};

export default meta;
type Story = StoryObj<typeof CtaSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
