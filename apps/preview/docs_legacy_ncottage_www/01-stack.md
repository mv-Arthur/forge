# 01 — Stack

Quoted from live `~/ncottage.ru/composer.json` (SSH 2026-08-20).

## Bedrock

- Composer package: `roots/bedrock`
- `require.roots/wordpress`: **5.2.3**
- Also required: `roots/wp-config` 1.0.0, `roots/wp-password-bcrypt` 1.0.0, `vlucas/phpdotenv` ^3.4.0, `oscarotero/env` ^1.2.0, PHP `>=7.1`
- `extra.wordpress-install-dir`: `public_html/wp`
- Installer paths: `public_html/app/{mu-plugins,plugins,themes}/{$name}/`

`wp-cli.yml`: `path: public_html/wp`, `server.docroot: public_html`.

Media URLs on the live site use `/app/uploads/` (Bedrock web root), matching fixture image URLs.

## Theme — Sage 9

Live `public_html/app/themes/sage/resources/style.css`:

- Theme Name: Sage Starter Theme
- Version: **9.0.9**
- Text Domain: sage

`sage/composer.json` name `roots/sage`; requires `roots/sage-lib` ~9.0.9, `soberwp/controller` ~2.1.0, `roots/sage-woocommerce` ^1.0, `illuminate/support` 5.6.*.

Layout:

- Blade views: `resources/views/` (`inventories/blade-views.txt`, 257 files)
- PHP: `app/{admin,filters,helpers,setup}.php`, `app/Controllers/{App,FrontPage}.php`, `resources/functions.php`

## Plugin groups (installed dirs, `inventories/plugins.txt`)

Not all dirs are necessarily active — `active_plugin_count` is filled from `wp_options.active_plugins` in item 3.1.

| Group | Dirs |
|---|---|
| WooCommerce | `woocommerce`, `woocommerce-ajax-filters`, `advanced-woo-search`, `woocatbase` (custom), `wpseo-woocommerce` |
| ACF | `advanced-custom-fields`, `acf-repeater`, `acf-options-page`, `acf-content-analysis-for-yoast-seo` |
| Page builders | `elementor`, `elementor-pro` |
| Forms | `contact-form-7`, `contact-form-7-dynamic-text-extension`, `drag-and-drop-multiple-file-upload-contact-form-7`, `wpforms` |
| SEO | `wordpress-seo`, `wordpress-seo-premium` |
| Cache | `wp-rocket` |
| Import/export | `wp-all-import-pro`, `wp-all-export-pro`, add-ons, `product-csv-import-export-for-woocommerce`, `wp-sheet-editor-premium`, `duplicator-pro` |
| Other | `jetpack`, `redirection`, `insert-headers-and-footers`, `cyr2lat`, `soil`, `robin-image-optimizer`, `regenerate-thumbnails`, `duplicate-post` |

## MU-plugins

- `bedrock-autoloader.php`
- `disallow-indexing.php`
- `register-theme-directory.php`

## Three renderers

1. Sage Blade page templates (`template-*.blade.php`)
2. WooCommerce template overrides under `resources/views/woocommerce/`
3. Elementor (`elementor` + `elementor-pro`) — page assignment from `_elementor_edit_mode` / `_wp_page_template` (item 3.1)
