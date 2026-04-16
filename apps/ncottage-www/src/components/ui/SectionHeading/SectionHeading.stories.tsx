import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeading } from "./SectionHeading";

const meta: Meta<typeof SectionHeading> = {
    title: "UI/SectionHeading",
    component: SectionHeading,
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Centered: Story = {
    args: {
        label: "Проекты",
        title: "Популярные проекты домов",
        description: "Готовые проекты с фиксированной стоимостью.",
        align: "center",
    },
};

export const Left: Story = {
    args: {
        label: "Отзывы",
        title: "Что говорят наши клиенты",
        align: "left",
    },
};

export const TitleOnly: Story = {
    args: {
        title: "Строительство домов в СПб и ЛО",
        align: "center",
    },
};
