import type { MetadataRoute } from "next";
import { getSeo } from "@/data/settings";

// robots.txt: индексируем всё, кроме служебных страниц избранного/сравнения,
// и указываем на машинный sitemap.xml. Хост — из настройки seo (baseUrl).
export default async function robots(): Promise<MetadataRoute.Robots> {
    const seo = await getSeo();
    const base = seo.baseUrl.replace(/\/$/, "");
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/favourites", "/compare"],
        },
        sitemap: `${base}/sitemap.xml`,
        host: base,
    };
}
