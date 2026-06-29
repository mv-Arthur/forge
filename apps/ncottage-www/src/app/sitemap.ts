import type { MetadataRoute } from "next";
import { getArticles } from "@/data/blog";
import { getProjects } from "@/data/projects";
import { getPromos } from "@/data/promos";
import { getSelections } from "@/data/project-selections";
import { getServices } from "@/data/services";
import { getSeo } from "@/data/settings";
import { PROJECT_HUB_CATEGORIES } from "@/domain/technology";

// Машинный sitemap.xml. Статические маршруты + динамические детальные страницы
// из коллекций (проекты, услуги, статьи, акции, подборки). Хост берётся из
// настройки seo (baseUrl).
const STATIC_PATHS = [
    "/",
    "/projects",
    "/services",
    "/blog",
    "/promos",
    "/project-selections",
    "/reviews",
    "/faq",
    "/certificates",
    "/partners",
    "/vacancies",
    "/about",
    "/production",
    "/contacts",
    "/works",
    "/guarantee",
    "/mortgage",
    "/credit",
    "/maternity-capital",
    "/payment",
    "/requisites",
    "/privacy",
    "/offer",
    "/personal-data",
    "/sitemap",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const seo = await getSeo();
    const base = seo.baseUrl.replace(/\/$/, "");
    const [projects, services, articles, promos, selections] =
        await Promise.all([
            getProjects(),
            getServices(),
            getArticles(),
            getPromos(),
            getSelections(),
        ]);

    // Единая метка времени последней регенерации sitemap для записей без
    // собственной даты контента.
    const now = new Date();

    const entry = (
        path: string,
        priority: number,
        changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
        lastModified: Date = now
    ): MetadataRoute.Sitemap[number] => ({
        // Корень — без завершающего слеша, чтобы совпадать с canonical главной.
        url: `${base}${path === "/" ? "" : path}`,
        lastModified,
        changeFrequency,
        priority,
    });

    const articleDate = (value: string): Date => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? now : date;
    };

    return [
        ...STATIC_PATHS.map((p) => entry(p, p === "/" ? 1 : 0.7, "weekly")),
        ...PROJECT_HUB_CATEGORIES.map((c) =>
            entry(`/projects/${c.slug}`, 0.6, "weekly")
        ),
        ...projects.map((p) => entry(`/project/${p.slug}`, 0.8, "monthly")),
        ...services.map((s) => entry(`/services/${s.slug}`, 0.8, "monthly")),
        ...articles.map((a) =>
            entry(`/blog/${a.slug}`, 0.6, "monthly", articleDate(a.date))
        ),
        ...promos.map((p) => entry(`/promos/${p.slug}`, 0.7, "weekly")),
        ...selections.map((s) =>
            entry(`/project-selections/${s.slug}`, 0.6, "weekly")
        ),
    ];
}
