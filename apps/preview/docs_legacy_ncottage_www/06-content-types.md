# 06 — Content types

From `inventories/post-types.json` (USER `ncottaxz_db1@localhost`).

## `wp_posts` counts

| post_type | statuses |
|---|---|
| product | publish 329, draft 1 |
| page | publish 136, draft 13, private 1 |
| post | publish 56 (articles/blog) |
| attachment | inherit 6566 |
| acf-field | publish 1127 |
| acf-field-group | publish 43 |
| wpcf7_contact_form | publish 50 |
| wpforms | publish 2 |
| nav_menu_item | publish 543 |
| br_product_filter | publish 18 |
| elementor_library | publish 1 |
| wpcode | draft 2 |

## Top-level publish pages (parent 0) → Sage template

| slug | title | `_wp_page_template` | Elementor |
|---|---|---|---|
| (shop) proekty | Проекты домов | default | — |
| objects | Построенные и Строящиеся дома | template-built-houses | — |
| contact | Наши контакты | template-contacts | — |
| services | Наши услуги | template-services | — |
| o-nas | О нас | template-information-about | — |
| credit | Строительство дома в кредит | template-information-credit | — |
| materinskiy-kapital | Материнский капитал | template-information-matcapital | — |
| certificate | Лицензии и сертификаты | template-information-certificate | — |
| partners | Партнеры | template-partners-page | — |
| proektirovanie | Проектирование | template-design | — |
| stroitelstvo | Строительство домов | template-stroitelstvo-page-main | — |
| map | Карта объектов | template-map-page | — |
| compare | Сравнение | (none in meta) | — |
| favourites | Избранное | (none) | — |
| sitemap | Карта сайта | (none) | — |
| privacy | Политика конфиденциальности | (none) | — |
| akciya-2022 | Акция-2022 | template-econom | **builder** |
| akcziya-novyj-kottedzh | АКЦИЯ! "НОВЫЙ КОТТЕДЖ" | elementor_canvas | **builder** |

Full page list: `inventories/page-templates.json`.

Woo shop extras: `cart`, `checkout`, `my-account`.

Child trees exist under `stroitelstvo`, `montazh`, `objects` (parent 459).

acf-field / acf-field-group are ACF storage, not public URLs.
