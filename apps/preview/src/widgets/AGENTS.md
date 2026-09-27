# widgets

Правила: `FRONTEND_ARCHITECTURE.md`.

- контейнер: `'use client'`, UI-состояние, не импортирует другой контейнер
- разметка: без хуков и без `@/actions`
- остров `__`: хуки можно, actions/fetch/container нельзя
