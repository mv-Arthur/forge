import type { Meta, StoryObj } from "@storybook/react";
import { SiteSearch } from "./SiteSearch";

const meta: Meta<typeof SiteSearch> = {
    title: "Shared/SiteSearch",
    component: SiteSearch,
    parameters: { layout: "fullscreen" },
    decorators: [
        (Story) => (
            <div style={{ position: "relative", minHeight: "80vh" }}>
                <Story />
            </div>
        ),
    ],
    args: {
        open: true,
        onClose: () => {},
    },
};

export default meta;
type Story = StoryObj<typeof SiteSearch>;

export const Open: Story = {};

export const Closed: Story = {
    args: { open: false },
};
