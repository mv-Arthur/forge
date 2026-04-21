import type { Meta, StoryObj } from "@storybook/react";
import { CATEGORIES_SECTION } from "@/lib/constants";
import { getCategories } from "@/lib/data";
import { CategoriesSection } from "./CategoriesSection";

const categories = getCategories();

const meta: Meta<typeof CategoriesSection> = {
    title: "Sections/CategoriesSection",
    component: CategoriesSection,
    parameters: { layout: "fullscreen" },
    args: {
        title: CATEGORIES_SECTION.title,
        categories,
        cta: CATEGORIES_SECTION.cta,
    },
};

export default meta;
type Story = StoryObj<typeof CategoriesSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};

export const FewCategories: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
    args: {
        categories: categories.slice(0, 2),
    },
};
