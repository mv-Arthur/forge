import type { Preview } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "storybook/viewport";
import "../src/app/globals.css";

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: "light",
            values: [
                { name: "light", value: "#ffffff" },
                { name: "gray", value: "#f8f8f8" },
                { name: "dark", value: "#2c2c2c" },
                { name: "green", value: "#479332" },
            ],
        },
        layout: "centered",
        viewport: { options: INITIAL_VIEWPORTS },
    },
};

export default preview;
