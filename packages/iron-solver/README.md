# @forge/iron-solver

Переиспользуемое application core для Iron Solver.

Пакет содержит orchestration use-cases и DI ports, но напрямую не запускает
`git`, `gh`, `pnpm`, provider-specific agent CLIs или браузерные инструменты.

Core отвечает за:

- типы project config;
- определения common/status/project labels;
- routing decisions по GitHub events;
- generic agent prompt templates в `prompt-templates/`;
- use-cases агентов: route, develop, review, QA, setup labels;
- parsing/rendering структурированных результатов review/QA;
- ports для GitHub, Git, agent runner, files, checks, tools, logger и clock.

Infrastructure предоставляет adapters для этих ports и собирает solver.

Agent provider выбирается в infrastructure через `AgentRunnerPort`; Codex — только
один из adapters, а не core dependency.

Prompt templates лежат в Markdown-файлах и рендерятся через `@forge/shared`.
Project-specific role prompts остаются в infrastructure project folders и
подставляются в эти templates.
