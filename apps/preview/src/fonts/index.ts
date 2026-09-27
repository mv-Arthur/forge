import localFont from "next/font/local";

const manrope = localFont({
    src: "./static/Manrope-wght.woff2",
    weight: "200 800",
    display: "swap",
    variable: "--font-manrope",
});

const catalog = {
    manrope,
};

export const fontManager = {
    vars() {
        return Object.values(catalog)
            .map((font) => font.variable)
            .filter(Boolean)
            .join(" ");
    },
    body() {
        return catalog.manrope.className;
    },
};
