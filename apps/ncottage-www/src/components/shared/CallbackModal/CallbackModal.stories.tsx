import type { Meta, StoryObj } from "@storybook/react";
import { CallbackModal } from "./CallbackModal";

const meta: Meta<typeof CallbackModal> = {
    title: "Shared/CallbackModal",
    component: CallbackModal,
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof CallbackModal>;

export const Open: Story = {
    args: { open: true, onClose: () => {} },
};

export const Closed: Story = {
    args: { open: false, onClose: () => {} },
};
