import type { Meta, StoryObj } from "@storybook/react";
import { REVIEWS_SECTION } from "@/lib/constants";
import { ReviewsSection } from "./ReviewsSection";

const meta: Meta<typeof ReviewsSection> = {
    title: "Sections/ReviewsSection",
    component: ReviewsSection,
    parameters: { layout: "fullscreen" },
    args: {
        title: REVIEWS_SECTION.title,
        showMoreLabel: REVIEWS_SECTION.showMoreLabel,
        prevLabel: REVIEWS_SECTION.prevLabel,
        nextLabel: REVIEWS_SECTION.nextLabel,
        reviews: REVIEWS_SECTION.reviews,
    },
};

export default meta;
type Story = StoryObj<typeof ReviewsSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
