# Iron Solver workflow

## Область

Iron Solver — подсистема AI-автоматизации для монорепы forge.

Текущий MVP автоматизирует только frontend-задачи для `apps/ncottage-www`.

Роли:

- `@forge/iron-solver` — переиспользуемое application core с use-cases и ports.
- `infrastructure/run_iron_solver` — composition root, adapters, prompts, schemas и CI/local job entrypoint.
- `frontend-developer:ncottage-www` — реализует задачи и исправляет замечания review/QA.
- `frontend-reviewer:ncottage-www` — ревьюит PR и оставляет структурированный feedback.
- `frontend-qa:ncottage-www` — тестирует поведение в браузере и оставляет feedback.

## Структура

```text
packages/iron-solver/
  src/            Use-cases, routing, ports, labels, config types, result helpers
  prompt-templates/ Generic Markdown templates, которые рендерит core

infrastructure/run_iron_solver/
  package.json    Iron Solver infrastructure package scripts
  src/index.ts    Local/CI job entrypoint
  src/job.ts      CLI argument parser
  src/composition.ts composition root
  src/adapters/   GitHub/Git/agent/files/checks/tools adapters
  projects/       Project-specific role prompts
  schemas/        Structured agent output schemas
  workflow/       Workflow documentation
  runner-setup/   Self-hosted runner documentation
```

GitHub-specific entrypoints остаются снаружи Iron Solver:

- `.github/workflows/iron-solver.yml` — тонкий GitHub Actions shim, который запускает `pnpm --dir infrastructure/run_iron_solver route`
- `.github/ISSUE_TEMPLATE/frontend-agent-task.md`

## Структура prompt-файлов

Generic stage templates лежат в `packages/iron-solver/prompt-templates/`.
Они используют `{{value}}` placeholders, которые рендерит `@forge/shared`.

У каждой project-specific AI-роли есть отдельная папка:

- `prompt.md` — русский canonical prompt, который читает TypeScript CLI.

CLI читает `prompt.md` из role folders.

Текущий project path:

```text
infrastructure/run_iron_solver/projects/ncottage-www/agents/<frontend-developer|frontend-reviewer|frontend-qa>/
```

## CLI

Workflow вызывает infrastructure job entrypoint:

```bash
pnpm --dir infrastructure/run_iron_solver route
```

Manual/local entry points:

```bash
pnpm --dir infrastructure/run_iron_solver develop <issue-number>
pnpm --dir infrastructure/run_iron_solver review <pr-number>
pnpm --dir infrastructure/run_iron_solver qa <issue-number>
pnpm --dir infrastructure/run_iron_solver setup-labels
```

## Labels

Обязательные routing labels:

- `frontend`
- `ai:codex`
- `project:ncottage-www`

`ai:codex` — текущий default agent label. Project может переопределить его через
`aiLabel` в `AiProjectConfig`, когда runner переключится на другого provider.

Status labels взаимоисключающие:

- `status:ready-for-develop`
- `status:in-develop`
- `status:review`
- `status:review-fixes`
- `status:ready-for-human-code-review`
- `status:ready-for-test`
- `status:testing`
- `status:qa-fixes`
- `status:ready-for-human-final-review`
- `status:needs-human-attention`

## State machine

```text
status:ready-for-develop
  -> frontend-developer:ncottage-www
  -> status:review

status:review
  -> frontend-reviewer:ncottage-www
  -> if failed: status:review-fixes -> frontend-developer:ncottage-www -> status:review
  -> if passed: status:ready-for-human-code-review

status:ready-for-human-code-review
  -> человек вручную ревьюит код в PR
  -> if rejected: человек пишет comments и ставит `status:review-fixes` на issue
  -> if approved: человек ставит `status:ready-for-test` на issue

status:ready-for-test
  -> frontend-qa:ncottage-www
  -> if failed: status:qa-fixes -> frontend-developer:ncottage-www -> status:review
  -> if passed: status:ready-for-human-final-review

status:ready-for-human-final-review
  -> человек вручную ревьюит PR и тестирует задачу
  -> человек вручную мержит PR
```

## Лимиты итераций

- Review loop: 5 неуспешных раундов review.
- QA loop: 5 неуспешных раундов QA.
- Когда лимит достигнут, задача переводится в `status:needs-human-attention`.

## Направление Dagger

Dagger должен оборачивать `infrastructure/run_iron_solver` как CI job/composition
root. Переиспользуемая логика остаётся в `@forge/iron-solver`, поэтому
Dagger adapter должен только предоставить runtime, repository mount, secrets и
command execution.

Первая версия оставляет self-hosted macOS runner как runtime, потому что stages
нуждаются в локальном `gh`, `git`, выбранном agent CLI, `pnpm` и Chrome.

## Как запустить задачу

1. Создать issue по шаблону `Frontend AI task`.
2. Заполнить acceptance criteria и QA scenarios.
3. Добавить labels `frontend`, `ai:codex` и `project:ncottage-www`.
4. Добавить `status:ready-for-develop`, когда задача готова к разработке.
5. Self-hosted runner запустит `Iron Solver`; `route` выберет следующий stage.
6. После успешного AI review человек ревьюит PR и добавляет `status:ready-for-test` на issue.
7. После успешного AI QA человек делает final check и вручную мержит PR.
