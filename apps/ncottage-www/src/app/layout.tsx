import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/widgets/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { ADDRESSES, CITIES, EMAIL, PHONES, WORK_HOURS } from "@/content/contacts";
import { NAV_ITEMS } from "@/content/site";

const CITY_ADDRESSES = {
    spb: ADDRESSES.spb,
    msk: ADDRESSES.msk,
};

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    variable: "--font-display",
    display: "swap",
});

import "./globals.css";

export const metadata: Metadata = {
    title: "Строительство домов в СПб и ЛО под ключ — Новый Коттедж",
    description:
        "Строительная компания Новый Коттедж. Строительство загородных домов под ключ в Санкт-Петербурге и Ленинградской области.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
            <body>
                <SiteHeader
                    cities={CITIES}
                    phones={PHONES}
                    addresses={CITY_ADDRESSES}
                    email={EMAIL}
                    workHours={WORK_HOURS}
                    navItems={NAV_ITEMS}
                />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
