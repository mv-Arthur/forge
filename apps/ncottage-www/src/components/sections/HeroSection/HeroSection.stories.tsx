import type { Meta, StoryObj } from "@storybook/react";
import { HERO } from "@/lib/constants";
import { HeroSection } from "./HeroSection";

const meta: Meta<typeof HeroSection> = {
    title: "Sections/HeroSection",
    component: HeroSection,
    parameters: { layout: "fullscreen" },
    args: {
        subtitle: HERO.subtitle,
        title: HERO.title,
        text: HERO.text,
        cta: HERO.cta,
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
        subtitle: "Индивидуальное проектирование",
        title: "Дома под ключ",
        text: "от фундамента до финишной отделки — один подрядчик",
        cta: { label: "Оставить заявку", href: "/contacts" },
    },
};
