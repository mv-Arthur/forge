import type { Metadata } from "next";
import type { Seo } from "@/domain/settings";

// metadataBase должен быть абсолютным URL. baseUrl правится из админки, поэтому
// невалидное значение (без схемы) не должно ронять рендер — возвращаем undefined
// (Next откатывается на относительные canonical), а не бросаем из new URL().
export function toMetadataBase(baseUrl: string): URL | undefined {
    try {
        return new URL(baseUrl);
    } catch {
        return undefined;
    }
}

// Единый билдер мета-тегов страницы: title/description, canonical и Open Graph.
// metadataBase задаётся в layout, поэтому canonical и og:url абсолютны. og:image
// берётся из переданного image (картинка сущности) либо из дефолта seo.ogImageUrl;
// пустые опускаются.
interface PageMetadataInput {
    seo: Seo;
    title: string;
    description: string;
    path: string;
    image?: string;
    type?: "website" | "article";
}

export function buildPageMetadata({
    seo,
    title,
    description,
    path,
    image,
    type = "website",
}: PageMetadataInput): Metadata {
    const ogImage = image || seo.ogImageUrl;
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            title,
            description,
            url: path,
            siteName: seo.siteName,
            locale: "ru_RU",
            type,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
    };
}
