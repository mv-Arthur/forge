import type {
    Page,
    PageSectionDataMap,
    PageSectionType,
} from "@/domain/page";
import { warnApiFallback } from "@/lib/api-fallback";
import { aboutPage } from "./pages/about";
import { contactsPage } from "./pages/contacts";
import { creditPage } from "./pages/credit";
import { guaranteePage } from "./pages/guarantee";
import { homePage } from "./pages/home";
import { maternityCapitalPage } from "./pages/maternity-capital";
import { mortgagePage } from "./pages/mortgage";
import { offerPage } from "./pages/offer";
import { paymentPage } from "./pages/payment";
import { personalDataPage } from "./pages/personal-data";
import { privacyPage } from "./pages/privacy";
import { productionPage } from "./pages/production";
import { requisitesPage } from "./pages/requisites";
import { worksPage } from "./pages/works";

// Страницы с секциями приходят из ncottage-api. ISR-теги pages/page:<key>; при
// недоступности API отдаём статический fallback (он же — источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

const FALLBACKS: Record<string, Page> = {
    home: homePage,
    about: aboutPage,
    production: productionPage,
    mortgage: mortgagePage,
    credit: creditPage,
    "maternity-capital": maternityCapitalPage,
    payment: paymentPage,
    contacts: contactsPage,
    works: worksPage,
    guarantee: guaranteePage,
    privacy: privacyPage,
    offer: offerPage,
    requisites: requisitesPage,
    "personal-data": personalDataPage,
};

export async function getPage(key: string): Promise<Page | undefined> {
    const fallback = FALLBACKS[key];
    if (!API_URL) return fallback;
    try {
        const res = await fetch(`${API_URL}/pages/${encodeURIComponent(key)}`, {
            next: { revalidate: REVALIDATE, tags: ["pages", `page:${key}`] },
        });
        if (!res.ok) return fallback;
        return (await res.json()) as Page;
    } catch (error) {
        warnApiFallback(`page ${key}`, error);
        return fallback;
    }
}

// Типизированный доступ к первой секции заданного типа.
export function section<T extends PageSectionType>(
    page: Page | undefined,
    type: T
): PageSectionDataMap[T] | undefined {
    const found = page?.sections.find((s) => s.type === type);
    return found ? (found.data as PageSectionDataMap[T]) : undefined;
}

// Все секции заданного типа (для страниц, где тип повторяется).
export function sectionsOf<T extends PageSectionType>(
    page: Page | undefined,
    type: T
): PageSectionDataMap[T][] {
    return (page?.sections ?? [])
        .filter((s) => s.type === type)
        .map((s) => s.data as PageSectionDataMap[T]);
}
