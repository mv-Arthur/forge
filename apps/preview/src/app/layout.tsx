import type { Metadata } from "next";
import { fontManager } from "@/fonts";
import "@/styles/www-tokens.css";
import "@/styles/globals.css";
import { unwrapAction } from "@/types/action";
import { getCatalogNav } from "@/actions/catalog/get-catalog-nav";
import { SiteHeaderContainer } from "@/widgets/site-header/site-header.container";
import { FloatingContactContainer } from "@/widgets/floating-contact/floating-contact.container";
import { SiteFooter } from "@/widgets/site-footer/site-footer";

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

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { nav } = unwrapAction(await getCatalogNav());
    return (
        <html lang="ru" className={fontManager.vars()}>
            <body className={fontManager.body()}>
                <SiteHeaderContainer catalogNav={nav} />
                {children}
                <SiteFooter />
                <FloatingContactContainer />
            </body>
        </html>
    );
}
