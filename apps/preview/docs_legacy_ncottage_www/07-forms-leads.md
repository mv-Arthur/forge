# 07 — Forms and leads

## Contact Form 7

`post_type=wpcf7_contact_form` publish **50**. Inventory: `inventories/cf7-forms.json` (`id` + `title` only; `_mail` bodies not copied).

WPForms: **2** publish posts (`wpforms`). Entry tables exist (`wp_wpforms_entries`).

## Theme wiring (`inventories/php-hooks.txt`)

- `add_action('wpcf7_mail_sent', 'your_wpcf7_mail_sent_function')` — `functions.php:99`
- `wpcf7_form_action_url` rewritten to `/` (`functions.php:3224`)
- AJAX: `wp_ajax_forms_filter`, `wp_ajax_count_of_questions` (+ nopriv)
- `enqueue_cf7_js_first` on `wp_enqueue_scripts`

## Blade surfaces

| Blade | Role |
|---|---|
| `front-page/front-page-green-row-request.blade.php` | Home request row |
| `front-page/template-garantiya-form.blade.php` | Guarantee form on home |
| `front-page/template-front-page-contacts.blade.php` | Home contacts |
| `template-contacts.blade.php` | Contacts page |
| `template-design-page/template-design-page-form.blade.php` | Design request |

CF7 titles (subset) vs likely pages:

| id | title | likely surface |
|---|---|---|
| 174 | Заказать звонок (модальное окно) | global modal |
| 1661 | Остались вопросы? (Главная) | front-page |
| 1693 | Оставить заявку (Проекты домов) | single-product |
| 1701 | Записаться на просмотр объекта (Построенные дома) | template-built-houses |
| 426-related 436 | contacts page ACF | template-contacts |
| 7476 | Сообщить о проблеме (Гарантия) | template-information-garantiya |
| 1695 | Подать заявку на кредит | template-information-credit |

SMTP/Telegram tokens: not present in `php-hooks.txt` grep; any values would be `<redacted>`.
