import type { Meta, StoryObj } from "@storybook/react";
import { HERO } from "@/data/pages/home";
import { HeroSection } from "./HeroSection";

const meta: Meta<typeof HeroSection> = {
    title: "Sections/HeroSection",
    component: HeroSection,
    parameters: { layout: "fullscreen" },
    args: {
        eyebrow: HERO.eyebrow,
        title: HERO.title,
        titleAccent: HERO.titleAccent,
        text: HERO.text,
        primaryCta: HERO.primaryCta,
        secondaryCta: HERO.secondaryCta,
        trust: HERO.trust,
        image: HERO.image,
    },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};

export const CustomCopy: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
    args: {
        eyebrow: "Индивидуальное проектирование · СПб",
        title: "Дом под ключ от",
        titleAccent: "архитектора",
        text: "От эскиза до финишной отделки — один подрядчик, один договор, фиксированная цена.",
        primaryCta: { label: "Подобрать проект", href: "#" },
        secondaryCta: { label: "Смотреть каталог", href: "#" },
    },
};
