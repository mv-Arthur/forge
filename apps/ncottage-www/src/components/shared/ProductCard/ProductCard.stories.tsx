import type { Meta, StoryObj } from "@storybook/react";
import type { Project } from "@/domain/project";
import { ProductCard } from "./ProductCard";

// Статичная фикстура для Storybook: проекты теперь приходят из API,
// поэтому стори не зависят от рантайм-данных.
const sampleProject: Project = {
    slug: "nord",
    name: "Норд",
    technology: "gas-concrete",
    area: 156,
    floors: 2,
    bedrooms: 4,
    bathrooms: 2,
    price: 4850000,
    image: "/images/projects/nord.jpg",
    images: ["/images/projects/nord.jpg"],
    description:
        "Современный двухэтажный дом из газобетона с панорамными окнами и просторной террасой.",
    specs: {
        dimensions: "10x13",
        roofType: "Двускатная",
        foundation: "Ленточный",
        wallMaterial: "Газобетон D400",
        buildTime: "4-5 месяцев",
    },
    style: "modern",
    features: ["panoramic-windows", "terrace", "second-light"],
    livingType: "permanent",
    featured: true,
};

const meta: Meta<typeof ProductCard> = {
    title: "Shared/ProductCard",
    component: ProductCard,
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 360 }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Grid: Story = {
    args: { project: sampleProject, variant: "grid" },
};

export const List: Story = {
    args: { project: sampleProject, variant: "list" },
    decorators: [
        (Story) => (
            <div style={{ width: 800 }}>
                <Story />
            </div>
        ),
    ],
};

export const Premium: Story = {
    args: {
        project: { ...sampleProject, slug: "karl", name: "Карл" },
        variant: "grid",
    },
};
