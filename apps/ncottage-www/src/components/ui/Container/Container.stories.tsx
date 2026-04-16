import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container";

const meta: Meta<typeof Container> = {
    title: "UI/Container",
    component: Container,
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
    args: {
        children: (
            <div
                style={{
                    padding: 40,
                    background: "#f8f8f8",
                    border: "1px dashed #ccc",
                    textAlign: "center",
                    color: "#535353",
                }}
            >
                max-width: 1170px container
            </div>
        ),
    },
};
