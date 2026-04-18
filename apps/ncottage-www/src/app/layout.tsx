import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
    ADDRESSES,
    CITIES,
    EMAIL,
    PHONES,
    WORK_HOURS,
} from "@/lib/constants";
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
                <Header
                    cities={CITIES}
                    phones={PHONES}
                    addresses={{ spb: ADDRESSES.spb, msk: ADDRESSES.msk }}
                    email={EMAIL}
                    workHours={WORK_HOURS}
                />
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
