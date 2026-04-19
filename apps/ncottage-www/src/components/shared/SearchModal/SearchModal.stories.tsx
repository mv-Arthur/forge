import type { Meta, StoryObj } from "@storybook/react";
import { SearchModal } from "./SearchModal";

const meta: Meta<typeof SearchModal> = {
    title: "Shared/SearchModal",
    component: SearchModal,
    parameters: { layout: "fullscreen" },
    args: {
        open: true,
        onClose: () => {},
    },
};

export default meta;
type Story = StoryObj<typeof SearchModal>;

export const Open: Story = {};

export const Closed: Story = {
    args: { open: false },
};
