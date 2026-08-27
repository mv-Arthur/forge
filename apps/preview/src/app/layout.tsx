import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@/styles/www-tokens.css";
import "@/styles/globals.css";
import { SiteHeaderContainer } from "@/widgets/site-header/site-header.container";
import { FloatingContactContainer } from "@/widgets/floating-contact/floating-contact.container";
import { SiteFooter } from "@/widgets/site-footer/site-footer";

const manrope = Manrope({
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-manrope",
});

export const metadata: Metadata = {
    title: "Новый Коттедж — дома под ключ в СПб и Ленобласти",
    description:
        "Готовые проекты, гарантия 7 лет, фиксированная смета. Строим дома под ключ с 2007 года.",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru" className={manrope.variable}>
            <body className={manrope.className}>
                <SiteHeaderContainer />
                {children}
                <SiteFooter />
                <FloatingContactContainer />
            </body>
        </html>
    );
}
