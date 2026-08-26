# 02 — Routing (filesystem + sitemap)

## WordPress options (live SELECT via tunnel, user `@localhost`)

- `permalink_structure`: `/%category%/%postname%/`
- `home`: `https://ncottage.test/wp` (stored option; public origin is `https://ncottage.ru`)
- `siteurl`: `https://ncottage.test/wp`
- `elementor_edit_mode_count:` 6 (`wp_postmeta._elementor_edit_mode='builder'`)
- Page rows with `_wp_page_template`: `inventories/page-templates.json` (`page_count` 150)

Elementor is installed (`elementor`, `elementor-pro`) but only 6 posts are in builder mode — most public pages are Sage templates or WooCommerce, not Elementor canvases.

## robots.txt (`public_html/robots.txt`)

- `User-Agent: *`
- Allow: css/js, uploads, wp image files
- Disallow: wp-login, wp-json, xmlrpc, wp-admin, wp-includes, wp-content, trackback, comments, `/?feed=`, `/?s=`, `*/?*`, `/cdn-cgi/*`
- One extra Disallow: `/index.php?_route_=services/kakoj-karkasnyj-dom-luchshe`
- `Clean-param: url&format`
- `Sitemap: https://ncottage.ru/sitemap.xml`

## sitemap.xml

- Single `urlset` (not a sitemap index)
- Unique `<loc>` count: **1055** (`inventories/live-paths.txt`)
- Origin: `https://ncottage.ru`

### First-path counts

| Prefix | Count |
|---|---|
| `/proekty` | 934 |
| `/objects` | 41 |
| `/articles` | 38 |
| `/o-nas` | 8 |
| `/montazh` | 6 |
| `/specials` | 6 |
| `/stroitelstvo` | 5 |
| `/contact` | 2 |
| `/privacy` | 2 |
| `/` (home) | 1 |
| other singles | map, credit, materinskiy-kapital, services, sitemap, proektirovanie, stroitelstvo-*, blagoustrojstvo, demontazh, otdelochnye-raboty |

## Sage URL prefixes (from Blade Template Name + sitemap)

| Prefix | Engine |
|---|---|
| `/proekty/` | WooCommerce `archive-product.blade.php` / `taxonomy-product_cat.blade.php` / `single-product.blade.php` |
| `/objects/` | `template-built-houses.blade.php` + item |
| `/articles/` | WP posts (`single.blade.php` / `index.blade.php`) |
| `/` | `front-page.blade.php` + `FrontPage.php` |
| `/contact` | `template-contacts.blade.php` |
| `/services` | `template-services.blade.php` |
| `/proektirovanie` | `template-design.blade.php` |
| `/stroitelstvo*` | `template-stroitelstvo-page-*.blade.php` and building-* templates |
