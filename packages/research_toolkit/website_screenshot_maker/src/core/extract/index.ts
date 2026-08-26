/**
 * Точка входа модуля extract.
 *
 * Вход: текст robots.txt / sitemap XML / HTML.
 * Выход: URL из Sitemap:, <loc>, href; признак вложенного sitemap.
 *
 * Не импортировать extract.ts напрямую.
 */
export {
    parseRobotsSitemaps,
    parseSitemapLocs,
    parseHtmlHrefs,
    isNestedSitemap,
} from "./extract.js";
