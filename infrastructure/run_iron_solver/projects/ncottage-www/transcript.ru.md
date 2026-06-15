# ncottage-www AI project — русская версия

Project-specific AI automation для `apps/ncottage-www`.

## Routing labels

- `frontend`
- `ai:codex`
- `project:ncottage-www`

## Оркестрация

Routing и status transitions выполняет детерминированный TypeScript CLI в `infrastructure/run_iron_solver/src`. В MVP нет LLM orchestrator agent.

## AI-роли

- `frontend-developer`
- `frontend-reviewer`
- `frontend-qa`

В каждой папке роли лежит:

- `prompt.md` — русский canonical prompt, который использует TypeScript CLI.

CLI читает `prompt.md`.

## Branch naming

AI branches используют:

```text
ai/ncottage-www-<issue-number>
```

## Human gates

- `status:ready-for-human-code-review` блокирует AI QA, пока человек не отревьюит PR.
- Добавь `status:ready-for-test` на issue после approve кода.
- `status:ready-for-human-final-review` означает, что AI QA прошёл и PR готов к final human review.
