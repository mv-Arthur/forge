# 08 — Integrations

Table of presence. Option **values** (header HTML, pixels) not dumped.

| name | source | present |
|---|---|---|
| jetpack | plugin (`inventories/plugins.txt` + `active_plugins`) | yes |
| insert-headers-and-footers | plugin + `wp_options` names `ihaf_insert_header`, `ihaf_insert_body`, `ihaf_insert_footer`, `ihaf_activated` | yes (names only) |
| wp-rocket | plugin + tables `wp_wpr_*` | yes |
| yoast wordpress-seo | plugin + `wp_yoast_*` + php-hooks `wpseo_*` | yes |
| contact-form-7 | plugin + php-hooks `wpcf7_*` | yes |
| woocommerce | plugin | yes |
| elementor / elementor-pro | plugin; 6 builder posts | yes |
| comagic (`ps_comagic`) | php-hooks (commented `add_action wp_head`) | no (commented) |
| UTM cookies (`save_utm_to_cookie`) | php-hooks `add_action init` | yes |
| mailchimp | table `wp_mailchimp_carts` | yes (table) |
| telegram | php-hooks grep | no |
| roistat | php-hooks grep | no |
| amocrm / bitrix24 | php-hooks grep | no |
| metrika / GTM | not in php-hooks; may live in `ihaf_insert_*` HTML (not copied) | unknown in PHP; headers plugin present |

`active_plugin_count`: 31 (`inventories/post-types.json`).
