// Построители JSON-LD (schema.org) для страниц. Возвращают объект-тип БЕЗ
// "@context" — его добавляет компонент <JsonLd>. Относительные пути картинок
// разворачиваются в абсолютные URL от baseUrl.
import type { Article, Contacts, Project, Review, Seo } from "@forge/shared";

type Node = Record<string, unknown>;

function trimBase(seo: Seo): string {
    return seo.baseUrl.replace(/\/$/, "");
}

function absUrl(base: string, path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function organizationJsonLd(seo: Seo, contacts: Contacts): Node {
    const base = trimBase(seo);
    return {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: seo.siteName,
        url: base,
        logo: absUrl(base, "/images/logo.png"),
        ...(contacts.email ? { email: contacts.email } : {}),
        ...(contacts.phones[0]
            ? { telephone: contacts.phones[0].number }
            : {}),
        ...(contacts.addresses.length
            ? {
                  address: contacts.addresses.map((a) => ({
                      "@type": "PostalAddress",
                      addressLocality: a.label,
                      streetAddress: a.value,
                  })),
              }
            : {}),
    };
}

export function webSiteJsonLd(seo: Seo): Node {
    const base = trimBase(seo);
    return {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: seo.siteName,
        url: base,
        inLanguage: "ru-RU",
        publisher: { "@id": `${base}/#organization` },
    };
}

export function articleJsonLd(article: Article, seo: Seo): Node {
    const base = trimBase(seo);
    return {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        ...(article.image ? { image: absUrl(base, article.image) } : {}),
        author: { "@type": "Organization", name: seo.siteName },
        publisher: {
            "@type": "Organization",
            name: seo.siteName,
            logo: {
                "@type": "ImageObject",
                url: absUrl(base, "/images/logo.png"),
            },
        },
        mainEntityOfPage: `${base}/blog/${article.slug}`,
    };
}

export function productJsonLd(project: Project, seo: Seo): Node {
    const base = trimBase(seo);
    return {
        "@type": "Product",
        name: project.name,
        description: project.description,
        image: absUrl(base, project.image),
        offers: {
            "@type": "Offer",
            price: project.price,
            priceCurrency: "RUB",
            availability: "https://schema.org/InStock",
            url: `${base}/project/${project.slug}`,
        },
    };
}

export function faqPageJsonLd(
    items: { question: string; answer: string }[]
): Node {
    return {
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
    };
}

// Отзывы публикуются как review[] организации. Поле даты опущено: Review.date —
// свободный текст ("2023", "22.02.2019"), не машинный ISO.
export function reviewsJsonLd(reviews: Review[], seo: Seo): Node {
    const base = trimBase(seo);
    return {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: seo.siteName,
        url: base,
        review: reviews.map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.author },
            reviewBody: review.text,
            itemReviewed: { "@type": "Organization", name: seo.siteName },
        })),
    };
}
