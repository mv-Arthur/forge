import type { Meta, StoryObj } from "@storybook/react";
import { PROJECT_PICKER } from "@/content/home";
import { ProjectPicker } from "./ProjectPicker";

const meta: Meta<typeof ProjectPicker> = {
    title: "Sections/ProjectPicker",
    component: ProjectPicker,
    parameters: { layout: "fullscreen" },
    args: {
        title: PROJECT_PICKER.title,
        text: PROJECT_PICKER.text,
        price: PROJECT_PICKER.price,
        area: PROJECT_PICKER.area,
        technologies: PROJECT_PICKER.technologies,
        floors: PROJECT_PICKER.floors,
        submitLabel: PROJECT_PICKER.submitLabel,
    },
};

export default meta;
type Story = StoryObj<typeof ProjectPicker>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};

export const OverlapHero: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
    args: { overlap: true },
    decorators: [
        (Story) => (
            <div>
                <div
                    style={{
                        height: 420,
                        background:
                            "linear-gradient(135deg, #2c2c2c, #479332)",
                    }}
                />
                <Story />
            </div>
        ),
    ],
};
