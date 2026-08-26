# 04 — WooCommerce catalog

Live `node scripts/export-fixtures-from-db.mjs --parity-only` (tunnel, 2026-08-20):

```
PRODUCTS_DB=329
PRODUCTS_FIXTURE=329
OBJECTS_DB=90
OBJECTS_FIXTURE=90
PRODUCTS_MISSING=0
PRODUCTS_EXTRA=0
OBJECTS_MISSING=0
OBJECTS_EXTRA=0
POST_MERGE_VARIANTS=329
PRODUCTS_DROPPED_SAME_TECH=0
PRICE_SAMPLE_OK
PARITY_OK
```

`.export-manifest.json`: `products_count` 329, `objects_count` 90, encoding `one_row_per_product_for_mergeProjects`.

`wp_posts`: `product` publish **329** (draft 1). Matches fixtures.

## URL / categories

Live sitemap: **934** `/proekty/*` locs. Product permalinks live as `https://ncottage.ru/proekty/<tech-cat>/<slug>/`.

`TECH_CAT` (`export-fixtures-from-db.mjs`):

| Internal tech | product_cat slug |
|---|---|
| gas_concrete | `doma-iz-gazobetona` |
| frame | `karkasnye-doma` |
| sip | `doma-iz-sip-panelei` |
| brick | `doma-iz-kirpicha` |
| fachwerk | `fahverkovye-doma` |

Taxonomy `product_cat` has 432 term_taxonomy rows (includes hierarchy). Attributes `pa_*`: area, kitchen, terrace, bedrooms, bathrooms, floors, technologies, garage, etc.

## ACF / postmeta on products

Exact keys used by the exporter (`EXACT_META_KEYS`): `_price`, `_regular_price`, `_thumbnail_id`, `_product_image_gallery`, `custom_product_title`, `label_project_name`, `card_some_text`, `link_sibling_1`…`link_sibling_4`, `technology_check_carcas|gazobet|seep|kirpich|fahverc`.

Live counts (publish products ≈330 rows of flags):

- `link_sibling_1` 309; `link_sibling_2`–`4` 330 — sibling products for other technologies
- `technology_check_*` 330 each
- package/price matrices `etapi_{gazobet,carcas,seep,kirpich}_N_etap_card_*price` (~330)

Full top-80 keys: `inventories/acf-meta-keys.txt` (postmeta, not ACF group titles).

ACF field groups (43 publish): `inventories/acf-field-groups.txt` including «Поля для "Карточки товара"» (`group_5de6272c5219b`) and category/page groups.

## Packages

`etapi_*` repeater-like keys encode build stages per technology (carcas/gazobet/seep/kirpich). Preview merge uses one row per product then groups by design slug.
