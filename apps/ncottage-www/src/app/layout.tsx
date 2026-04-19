import type { Metadata } from "next";
import { SiteHeader } from "@/components/widgets/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import {
    ADDRESSES,
    CITIES,
    EMAIL,
    NAV_ITEMS,
    PHONES,
    WORK_HOURS,
} from "@/lib/constants";

const CITY_ADDRESSES = {
    spb: ADDRESSES.spb,
    msk: ADDRESSES.msk,
};
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
        <html lang="ru">
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
