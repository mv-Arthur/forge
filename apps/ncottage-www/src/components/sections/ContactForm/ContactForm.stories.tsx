import type { Meta, StoryObj } from "@storybook/react";
import { CONTACT_FORM } from "@/lib/constants";
import { ContactForm } from "./ContactForm";

const meta: Meta<typeof ContactForm> = {
    title: "Sections/ContactForm",
    component: ContactForm,
    parameters: { layout: "fullscreen" },
    args: {
        title: CONTACT_FORM.title,
        subtitle: CONTACT_FORM.subtitle,
        nameLabel: CONTACT_FORM.nameLabel,
        namePlaceholder: CONTACT_FORM.namePlaceholder,
        phoneLabel: CONTACT_FORM.phoneLabel,
        phonePlaceholder: CONTACT_FORM.phonePlaceholder,
        messageLabel: CONTACT_FORM.messageLabel,
        messagePlaceholder: CONTACT_FORM.messagePlaceholder,
        submitLabel: CONTACT_FORM.submitLabel,
        privacy: CONTACT_FORM.privacy,
        image: CONTACT_FORM.image,
        successTitle: CONTACT_FORM.successTitle,
        successText: CONTACT_FORM.successText,
    },
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
