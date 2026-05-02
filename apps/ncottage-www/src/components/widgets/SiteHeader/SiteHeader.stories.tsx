import type { Meta, StoryObj } from "@storybook/react";
import { ADDRESSES, CITIES, EMAIL, PHONES, WORK_HOURS } from "@/content/contacts";
import { NAV_ITEMS } from "@/content/site";
import { SiteHeader } from "./SiteHeader";

const defaultArgs = {
    cities: CITIES,
    phones: PHONES,
    addresses: { spb: ADDRESSES.spb, msk: ADDRESSES.msk },
    email: EMAIL,
    workHours: WORK_HOURS,
    navItems: NAV_ITEMS,
};

const meta: Meta<typeof SiteHeader> = {
    title: "Widgets/SiteHeader",
    component: SiteHeader,
    parameters: { layout: "fullscreen" },
    args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
