import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    title: "UI/Button",
    component: Button,
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "outline", "ghost"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: { children: "Каталог проектов", variant: "primary", size: "md" },
};

export const Outline: Story = {
    args: { children: "Все проекты", variant: "outline", size: "md" },
};

export const Ghost: Story = {
    args: { children: "Назад", variant: "ghost", size: "md" },
};

export const Small: Story = {
    args: { children: "Заказать звонок", variant: "primary", size: "sm" },
};

export const Large: Story = {
    args: { children: "Получить консультацию", variant: "primary", size: "lg" },
};
