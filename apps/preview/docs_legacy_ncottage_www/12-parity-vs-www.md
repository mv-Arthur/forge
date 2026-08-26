# 12 — Parity: ncottage-www App Router vs legacy

`www-routes.txt` has **33** `page.tsx` files. Legacy evidence from Blade `Template Name`, `_wp_page_template` (`page-templates.json`), WooCommerce, sitemap prefixes.

| www route | legacy evidence |
|---|---|
| `page.tsx` (`/`) | `front-page.blade.php` + `FrontPage.php`; sitemap `/` |
| `about/page.tsx` | page `o-nas` → `template-information-about.blade.php` |
| `blog/page.tsx` | `post` publish 56; sitemap `/articles/` |
| `blog/[slug]/page.tsx` | `single.blade.php` + `/articles/<slug>/` |
| `certificates/page.tsx` | page `certificate` → `template-information-certificate.blade.php` |
| `compare/page.tsx` | page `compare`; file `template-compare.php` in views |
| `contacts/page.tsx` | page `contact` → `template-contacts.blade.php`; sitemap `/contact` |
| `credit/page.tsx` | page `credit` → `template-information-credit.blade.php`; sitemap `/credit` |
| `faq/page.tsx` | `template-information-faq.blade.php` (ACF FAQ group) |
| `favourites/page.tsx` | page `favourites` (no Sage Template Name) |
| `guarantee/page.tsx` | `template-information-garantiya.blade.php` + CF7 7476 |
| `maternity-capital/page.tsx` | page `materinskiy-kapital` → `template-information-matcapital.blade.php` |
| `mortgage/page.tsx` | overlaps credit/calc (`template-information-calc.blade.php`); no dedicated `ipoteka` page in top-level list |
| `offer/page.tsx` | missing as dedicated WP page in top-level publish list |
| `partners/page.tsx` | page `partners` → `template-partners-page.blade.php` |
| `payment/page.tsx` | missing as dedicated top-level page |
| `personal-data/page.tsx` | missing as dedicated top-level page (privacy exists) |
| `privacy/page.tsx` | page `privacy` |
| `production/page.tsx` | ACF group «Поля "Производство"»; not in top-level slug list |
| `project-selections/page.tsx` | missing as WP page; catalog uses `product_cat` instead |
| `project-selections/[slug]/page.tsx` | missing; closest `taxonomy-product_cat.blade.php` |
| `project/[slug]/page.tsx` | Woo `single-product.blade.php` (`/proekty/.../`) |
| `projects/page.tsx` | shop page `proekty` + `archive-product.blade.php` |
| `projects/[category]/page.tsx` | `taxonomy-product_cat.blade.php` |
| `promos/page.tsx` | sitemap `/specials` (6); Elementor promo pages `akciya-2022`, `akcziya-novyj-kottedzh` |
| `promos/[slug]/page.tsx` | those Elementor/econom templates |
| `requisites/page.tsx` | ACF group «Поля для "Реквизиты"»; child of about likely |
| `reviews/page.tsx` | `template-information-reviews.blade.php` |
| `services/page.tsx` | page `services` → `template-services.blade.php` |
| `services/[slug]/page.tsx` | building/stroitelstvo templates + `/montazh`, `/stroitelstvo-*` |
| `sitemap/page.tsx` | page `sitemap` |
| `vacancies/page.tsx` | `template-information-vacancy.blade.php` |
| `works/page.tsx` | page `objects` parent 459 → `template-built-houses.blade.php`; sitemap `/objects` |
