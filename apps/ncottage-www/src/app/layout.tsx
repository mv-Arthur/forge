import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/widgets/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import {
    getContacts,
    getFooter,
    getNavigation,
    getSeo,
    toContactLinks,
    toFooterContent,
    toHeaderContacts,
} from "@/data/settings";
import { SelectionProvider } from "@/lib/selection";
import { CallbackProvider } from "@/lib/callback";
import { FloatingContact } from "@/components/shared/FloatingContact";

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

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return {
        metadataBase: new URL(seo.baseUrl),
        title: seo.defaultTitle,
        description: seo.defaultDescription,
        openGraph: {
            title: seo.defaultTitle,
            description: seo.defaultDescription,
            url: "/",
            siteName: seo.siteName,
            locale: "ru_RU",
            type: "website",
            ...(seo.ogImageUrl ? { images: [seo.ogImageUrl] } : {}),
        },
    };
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [navigation, footer, contacts] = await Promise.all([
        getNavigation(),
        getFooter(),
        getContacts(),
    ]);
    const headerContacts = toHeaderContacts(contacts);
    const links = toContactLinks(contacts);

    return (
        <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
            <body>
                <SelectionProvider>
                    <CallbackProvider>
                        <SiteHeader
                            cities={headerContacts.cities}
                            phones={headerContacts.phones}
                            addresses={headerContacts.addresses}
                            email={headerContacts.email}
                            workHours={headerContacts.workHours}
                            navItems={navigation.items}
                        />
                        <main>{children}</main>
                        <Footer
                            content={toFooterContent(footer)}
                            vkHref={links.vk}
                        />
                        <FloatingContact
                            whatsapp={links.whatsapp}
                            telegram={links.telegram}
                        />
                    </CallbackProvider>
                </SelectionProvider>
            </body>
        </html>
    );
}
