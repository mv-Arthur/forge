# Fonts

Единственное место шрифтов в preview.

- файлы: `static/`
- регистрация: `index.ts` (`localFont` + `catalog` + `fontManager`)
- `src/app/layout.tsx`: `html className={fontManager.vars()}`, `body className={fontManager.body()}`
- в CSS только `font-family: var(--font-<alias>)`, например `var(--font-manrope)`
- дефолт сайта: `fontManager.body()` → сейчас `catalog.manrope`

Добавить шрифт:

1. woff2 в `static/`
2. `const name = localFont({ src, weight, display: "swap", variable: "--font-name" })` в `index.ts` (вызов на уровне модуля, не внутри функции)
3. ключ в `catalog`
4. в CSS: `var(--font-name)`
5. если это новый дефолт body - поменять `body()`

Удалить: ключ из `catalog`, файл из `static/`, `var(--font-*)` из CSS.

Нельзя:

- `next/font/google`
- `@font-face` в виджетах / `www-tokens.css` / `globals.css`
- `font-family: Manrope` (имя next/font - хеш, не `Manrope`)
- второй `localFont` вне `index.ts`
- вешать несколько `.className` на один узел (последний перебьёт `font-family`); на корень идут только `.variable` через `vars()`
