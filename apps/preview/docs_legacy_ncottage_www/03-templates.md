# 03 — Sage templates and WooCommerce overrides

Source: live `grep -n "Template Name"` on `public_html/app/themes/sage/resources/views` (2026-08-20) + `inventories/blade-views.txt` (257 files) + `inventories/php-files.txt`.

Controllers: `app/Controllers/App.php`, `app/Controllers/FrontPage.php`.

## Page templates (`Template Name`)

| File | Template Name |
|---|---|
| template-built-houses.blade.php | Шаблон - Построенные дома |
| template-built-houses-item.blade.php | Шаблон - Построенные дома - карточка реализованного проекта |
| template-built-houses-item.blade-new.php | Шаблон - Новый - Построенные дома - карточка реализованного проекта |
| template-contacts.blade.php | Шаблон - Контакты |
| template-services.blade.php | Шаблон - Услуги |
| template-design.blade.php | Шаблон - Проектирование |
| template-partners-page.blade.php | Шаблон - Страница партнеров |
| template-map-page.blade.php | Объекты на карте |
| template-custom.blade.php | Custom Template |
| template-econom.blade.php | Шаблон - Эконом |
| template-information-about.blade.php | Шаблон - О нас |
| template-information-calc.blade.php | Шаблон - Кредитный калькулятор |
| template-information-certificate.blade.php | Шаблон - Лицензии и сертификаты |
| template-information-credit.blade.php | Шаблон - В кредит |
| template-information-faq.blade.php | Шаблон - Вопросы-Ответы |
| template-information-garantiya.blade.php | Шаблон - Гарантия |
| template-information-matcapital.blade.php | Шаблон - Материнский капитал |
| template-information-reviews.blade.php | Шаблон - Отзывы |
| template-information-vacancy.blade.php | Шаблон - Вакансии |
| template-stroitelstvo-page-main.blade.php | Шаблон - Строительство домов - Общая |
| template-stroitelstvo-page-gazobeton.blade.php | Шаблон - Строительство домов из газобетона |
| template-stroitelstvo-page-frame.blade.php | Шаблон - Строительство каркасных домов |
| template-stroitelstvo-page-sip.blade.php | Шаблон - Строительство домов из СИП |
| template-stroitelstvo-page-brick.blade.php | Шаблон - Строительство домов из кирпича |
| template-building-foundation.blade.php | Шаблон - Строительство фундамента |
| template-building-foundation-item.blade.php | Шаблон - Строительство "выбранного" фундамента |
| template-building-baths.blade.php | Шаблон - Строительство бань |
| template-building-electrician.blade.php | Шаблон - Электрика |
| template-building-heating.blade.php | Шаблон - Отопление |
| template-building-water.blade.php | Шаблон - Водоответвление и водоснабжение |
| template-building-sewerage.blade.php | Шаблон - Канализация |
| template-building-ventilation.blade.php | Шаблон - Вентиляция |
| template-building-finish.blade.php | Шаблон - Отделочные работы |
| template-building-mantling.blade.php | Шаблон - Монтаж |
| template-building-dismantling.blade.php | Шаблон - Демонтаж |
| template-building-beautification.blade.php | Шаблон - Благоустройство |
| template-building-commercial-real-estate.blade.php | Шаблон - Строительство |
| template-testing.blade.php | Шаблон - Тест копия |
| template-compare.php | (file exists; no Template Name in grep of `*.blade.php` globs — listed in blade-views.txt) |

Sub-views without Template Name (included by parents): `template-building-page/*.blade.php`, `template-design-page/*.blade.php`.

## Core Blade

| File | Role |
|---|---|
| page.blade.php | Default page |
| single.blade.php | Single post |
| index.blade.php | Blog/index |
| front-page.blade.php | Home (uses FrontPage.php) |
| 404.blade.php | 404 |
| search.blade.php | Search |
| layouts/app.blade.php | App layout |
| partials/header.blade.php | Header |
| partials/footer.blade.php | Footer |

Home sections under `front-page/`: banner, advantages, house-types, project-popular, works, quiz, review, news, green-row, green-row-request, green-row-stages, widget, `template-front-page-contacts.blade.php`, `template-garantiya-form.blade.php`.

## WooCommerce overrides

| File | Role |
|---|---|
| woocommerce/archive-product.blade.php | Catalog archive |
| woocommerce/single-product.blade.php | Product (project) detail |
| woocommerce/taxonomy-product_cat.blade.php | Category archive |
| woocommerce/taxonomy-product_tag.php | Tag archive |
| woocommerce/loop/*.blade.php | Loop bits (price, pagination, orderby, …) |
| woocommerce/single-product/price.blade.php | Price |
| woocommerce/single-product/product-image.blade.php | Gallery |
| woocommerce/single-product/product-attributes.blade.php | Specs |
| woocommerce/single-product/related.blade.php | Related |
| woocommerce/single-product/add-to-cart/variable.blade.php | Variable add-to-cart |
| woocommerce/single-product-reviews.php | Reviews |

Many Woo PHP copies (emails, myaccount, checkout) exist under `resources/views/woocommerce/` — stock-ish overrides; catalog/detail are the Sage custom surface.

## URL prefixes (from template names + live product URLs)

- `/proekty/` — WooCommerce product catalog (`archive-product.blade.php`, `taxonomy-product_cat.blade.php`)
- built-houses — `template-built-houses.blade.php` + item
- `/` — `front-page.blade.php` + `FrontPage.php`

## PHP hooks (from `inventories/php-hooks.txt`)

Not a full paraphrase of `functions.php` (~180KB). Lines from live grep.

### Sage `resources/functions.php`

- `add_action('wpcf7_mail_sent', 'your_wpcf7_mail_sent_function')` (line 99)
- `add_filter('wpcf7_form_action_url', …)` rewrite CF7 action to `/` (3224)
- `add_action('wp_ajax_forms_filter' / nopriv)` (3219–3220)
- `add_action('wp_ajax_count_of_questions' / nopriv)` CF7 (3280–3281)
- `add_action('wp_enqueue_scripts', 'enqueue_cf7_js_first')` (3380)
- Woo: `woocommerce_enqueue_styles` emptied; currency symbol; thousands sep; catalog orderby; `loop_shop_per_page`; `pre_get_posts`; product permalink parent category only
- Yoast: `wpseo_title`, `wpseo_metadesc`, `wpseo_canonical`, breadcrumbs, `%%acf_project%%` replacement
- `add_action('init', 'save_utm_to_cookie')`
- Commented: `add_action('wp_head', 'ps_comagic')` (Comagic pixel, not active)

### `app/filters.php` / `app/setup.php` / `app/admin.php`

- Sage Blade template hierarchy (`filter_templates`, `template_include`)
- `woocommerce_display_product_attributes` filter
- `wp_enqueue_scripts` / `after_setup_theme` / `widgets_init` in `setup.php`
- Customizer hooks in `admin.php`

### `woocatbase` (`public_html/app/plugins/woocatbase/woocatbase.php`)

Custom WooCommerce category-base plugin:

- `add_action` on `created_product_cat` / `edited_product_cat` / `delete_product_cat` → `woocatbase_flush_activation`
- Admin: `admin_init`, `admin_menu`, `admin_enqueue_scripts`
- `add_filter('rewrite_rules_array', 'woocatbase_rules', 20)` using `woocommerce_permalinks` and `woocommerce_shop_page_id`

No SMTP/API secrets appeared in the grep inventory.
