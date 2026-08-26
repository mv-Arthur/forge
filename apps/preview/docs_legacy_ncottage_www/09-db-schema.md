# 09 — Database schema (table names only)

`SHOW TABLES` on `ncottaxz_db1` — **102** tables. No row dumps.

## Core WP

`wp_posts`, `wp_postmeta`, `wp_options`, `wp_terms`, `wp_term_taxonomy`, `wp_term_relationships`, `wp_termmeta`, `wp_users`, `wp_usermeta`, `wp_comments`, `wp_commentmeta`, `wp_links`.

## WooCommerce

`wp_woocommerce_*`, `wp_wc_*` (product_meta_lookup, orders, tax, sessions, attributes).

## ACF

Stored in `wp_posts` (`acf-field`, `acf-field-group`) + `wp_postmeta`. No separate `wp_acf_*` tables.

## CF7 / WPForms

CF7 forms are `wpcf7_contact_form` posts. WPForms: `wp_wpforms_entries`, `wp_wpforms_entry_fields`, `wp_wpforms_entry_meta`, `wp_wpforms_logs`, `wp_wpforms_tasks_meta`.

## Redirection

`wp_redirection_items`, `wp_redirection_groups`, `wp_redirection_logs`, `wp_redirection_404`.

## Yoast

`wp_yoast_indexable`, `wp_yoast_indexable_hierarchy`, `wp_yoast_migrations`, `wp_yoast_primary_term`, `wp_yoast_prominent_words`, `wp_yoast_seo_links`, `wp_yoast_seo_meta`.

## WP Rocket

`wp_wpr_rocket_cache`, `wp_wpr_above_the_fold`, `wp_wpr_rucss_used_css`.

## Elementor

`wp_e_events`, `wp_e_submissions*` (6 builder posts only).

## Import/export / other

WP All Import/Export: `wp_pmxi_*`, `wp_pmxe_*`. Duplicator: `wp_duplicator_pro_*`. BeRocket filters: `wp_braapf_*`, `wp_berocket_termmeta`. Mailchimp: `wp_mailchimp_carts`. Action Scheduler: `wp_actionscheduler_*`. CSV importer leftovers: `smackuci_*`, `wp_ultimate_csv_importer_*`.

Full name list captured at inventory time (102 names in scratch `q-tables.tsv`, not copied as a dump of data).
