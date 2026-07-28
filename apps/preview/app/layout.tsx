import type { Metadata } from "next";
import "@/styles/www-tokens.css";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/www/header/SiteHeader";
import { FloatingContact } from "@/components/FloatingContact";
import { Footer } from "@/components/Footer";


export const metadata: Metadata = {
    title: "Новый Коттедж — дома под ключ в СПб и Ленобласти",
    description:
        "Готовые проекты, гарантия 7 лет, фиксированная смета. Строим дома под ключ с 2014 года.",
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
        <html lang="ru">
            <head>
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                          :root {
                            --font-sans: "Inter", system-ui, sans-serif;
                            --font-display: "Inter", system-ui, sans-serif;
                          }
                        `,
                    }}
                />
            </head>
            <body>
                <SiteHeader />
                {children}
                <Footer />
                <FloatingContact />
            </body>
        </html>
    );
}
