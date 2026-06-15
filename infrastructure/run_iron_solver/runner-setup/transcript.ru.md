# Настройка self-hosted runner — русская версия

## Runner

Создай GitHub self-hosted runner для этого репозитория:

1. GitHub repo settings -> Actions -> Runners -> New self-hosted runner.
2. Выбери macOS.
3. Выполни install commands, которые покажет GitHub.
4. Добавь custom label `forge-ai`.
5. Запусти runner на машине, где доступны Codex и Chrome.

## Обязательные secrets

Добавь repository secrets:

- `OPENAI_API_KEY` — API key, который Codex использует в non-interactive runs.
- `AI_GITHUB_TOKEN` — fine-grained PAT для AI bot/user.

Для `AI_GITHUB_TOKEN` нужны права:

- contents: read/write
- issues: read/write
- pull requests: read/write
- metadata: read

Нужен именно PAT, а не стандартный `GITHUB_TOKEN`, потому что workflow actions,
вызванные через `GITHUB_TOKEN`, обычно не запускают follow-up workflow runs.

## Обязательные локальные инструменты

Установи на runner host:

```bash
npm install -g @openai/codex
brew install gh
corepack enable
```

TypeScript AI CLI компилируется из зависимостей репозитория во время workflow runs, поэтому глобальный TypeScript на runner не нужен.

Chrome должен быть доступен по стандартному macOS пути:

```text
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

## Начальные labels

После push workflow один раз запусти:

```bash
GH_TOKEN=<AI_GITHUB_TOKEN> pnpm --dir infrastructure/run_iron_solver setup-labels
```

## Первый тест

1. Создай issue из шаблона `Frontend AI task`.
2. Заполни acceptance criteria и QA scenarios.
3. Добавь labels `frontend`, `ai:codex`, `project:ncottage-www`,
   `status:ready-for-develop`.
4. Следи за `Iron Solver` в GitHub Actions.
5. Когда задача дойдёт до `status:ready-for-human-code-review`, вручную отревьюй PR.
6. Если код ok, добавь `status:ready-for-test` на issue, чтобы запустить AI QA.
7. Когда задача дойдёт до `status:ready-for-human-final-review`, сделай final check и вручную смержи PR.

Если workflow застрял, добавь `status:needs-human-attention` и посмотри uploaded artifact из упавшего job.
