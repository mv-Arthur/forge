import type { Meta, StoryObj } from "@storybook/react";
import { CONTACTS_MAP } from "@/lib/constants";
import { ContactsMap } from "./ContactsMap";

const meta: Meta<typeof ContactsMap> = {
    title: "Sections/ContactsMap",
    component: ContactsMap,
    parameters: { layout: "fullscreen" },
    args: {
        title: CONTACTS_MAP.title,
        addresses: CONTACTS_MAP.addresses,
        phones: CONTACTS_MAP.phones,
        email: CONTACTS_MAP.email,
        hours: CONTACTS_MAP.hours,
        mapUrl: CONTACTS_MAP.mapUrl,
        mapTitle: CONTACTS_MAP.mapTitle,
    },
};

export default meta;
type Story = StoryObj<typeof ContactsMap>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
