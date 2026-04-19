import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { NAV_ITEMS } from "@/lib/constants";
import { Navbar } from "./Navbar";

const meta: Meta<typeof Navbar> = {
    title: "Widgets/Navbar",
    component: Navbar,
    parameters: { layout: "fullscreen" },
    args: {
        navItems: NAV_ITEMS,
        mobileOpen: false,
        onMobileClose: fn(),
        onSearchClick: fn(),
        favouritesCount: 0,
        compareCount: 0,
    },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const TabletOpen: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
    args: { mobileOpen: true },
};

export const MobileOpen: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
    args: { mobileOpen: true },
};

export const WithCounters: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
    args: { favouritesCount: 3, compareCount: 2 },
};
