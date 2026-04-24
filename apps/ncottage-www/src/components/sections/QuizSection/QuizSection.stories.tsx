import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { QUIZ_SECTION } from "@/lib/constants";
import { QuizSection } from "./QuizSection";

const meta: Meta<typeof QuizSection> = {
    title: "Sections/QuizSection",
    component: QuizSection,
    parameters: { layout: "fullscreen" },
    args: {
        title: QUIZ_SECTION.title,
        speaker: QUIZ_SECTION.speaker,
        steps: QUIZ_SECTION.steps,
        prevLabel: QUIZ_SECTION.prevLabel,
        nextLabel: QUIZ_SECTION.nextLabel,
        submitLabel: QUIZ_SECTION.submitLabel,
        lastStepLabel: QUIZ_SECTION.lastStepLabel,
        successTitle: QUIZ_SECTION.successTitle,
        successText: QUIZ_SECTION.successText,
        onSubmit: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof QuizSection>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};
