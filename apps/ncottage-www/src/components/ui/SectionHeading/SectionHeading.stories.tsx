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
        eyebrow: "Каталог проектов",
        title: "Готовые проекты домов",
        titleAccent: "под ключ",
        lead: "Более 50 готовых решений по технологии, площади и этажности.",
        align: "center",
    },
};

export const Left: Story = {
    args: {
        eyebrow: "Отзывы клиентов",
        title: "Что говорят те, кто уже",
        titleAccent: "переехал",
        align: "left",
    },
};

export const TitleOnly: Story = {
    args: {
        title: "Строительство домов в СПб и ЛО",
        align: "center",
    },
};
