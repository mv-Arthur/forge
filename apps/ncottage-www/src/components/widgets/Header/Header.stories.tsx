import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Header } from "./Header";

const defaultArgs = {
    cities: [
        { code: "spb" as const, label: "Санкт-Петербург" },
        { code: "msk" as const, label: "Москва" },
    ],
    phones: {
        spb: { number: "+78123093818", display: "+7 (812) 309-38-18" },
        msk: { number: "+74952043856", display: "+7 (495) 204-38-56" },
    },
    addresses: {
        spb: "ул. Заставская, д. 31, к. 2, оф. 413",
        msk: "Варшавское ш. 35 с1, БЦ Ривер Плаза, оф. 412",
    },
    email: "info@ncottage.ru",
    workHours: "Пн–Пт: 10:00–19:00",
    activeCity: "spb" as const,
    onCityChange: fn(),
};

const meta: Meta<typeof Header> = {
    title: "Layout/Header",
    component: Header,
    parameters: { layout: "fullscreen" },
    args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Desktop: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
};

export const Tablet: Story = {
    globals: { viewport: { value: "ipad", isRotated: false } },
};

export const Mobile: Story = {
    globals: { viewport: { value: "iphone14", isRotated: false } },
};

export const OneCity: Story = {
    globals: { viewport: { value: "1440-900", isRotated: false } },
    args: {
        cities: [{ code: "spb", label: "Санкт-Петербург" }],
    },
};
