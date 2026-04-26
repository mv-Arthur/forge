import type { Meta, StoryObj } from "@storybook/react";
import { VIEW_REQUEST_SECTION } from "@/lib/constants";
import { ViewRequestSection } from "./ViewRequestSection";

const meta: Meta<typeof ViewRequestSection> = {
    title: "Sections/ViewRequestSection",
    component: ViewRequestSection,
    parameters: { layout: "fullscreen" },
    args: {
        title: VIEW_REQUEST_SECTION.title,
        nameLabel: VIEW_REQUEST_SECTION.nameLabel,
        namePlaceholder: VIEW_REQUEST_SECTION.namePlaceholder,
        phoneLabel: VIEW_REQUEST_SECTION.phoneLabel,
        phonePlaceholder: VIEW_REQUEST_SECTION.phonePlaceholder,
        submitLabel: VIEW_REQUEST_SECTION.submitLabel,
        privacy: VIEW_REQUEST_SECTION.privacy,
        successTitle: VIEW_REQUEST_SECTION.successTitle,
        successText: VIEW_REQUEST_SECTION.successText,
    },
};

export default meta;
type Story = StoryObj<typeof ViewRequestSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
