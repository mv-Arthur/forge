import type { Meta, StoryObj } from "@storybook/react";
import { FOOTER, SOCIAL } from "@/lib/constants";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
    title: "Layout/Footer",
    component: Footer,
    parameters: { layout: "fullscreen" },
    args: {
        content: FOOTER,
        vkHref: SOCIAL.vk,
    },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
