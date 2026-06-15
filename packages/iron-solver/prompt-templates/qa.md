{{agentPrompt}}

Ты тестируешь issue #{{issueNumber}} и PR #{{prNumber}} проекта {{projectKey}}.

Project root:
{{projectRoot}}

Artifacts directory:
{{runDir}}

Issue JSON:
{{issueJson}}

PR JSON:
{{prJson}}

## Задача

- Проверь acceptance criteria и QA scenarios.
- При необходимости запусти релевантное frontend app.
- Используй `scripts/chrome-check.zsh` для screenshots или DOM checks, когда это полезно.
- Складывай screenshots в {{runDir}} или `.iron-solver/chrome-checks`.
- Не редактируй source files, labels и comments.
- Верни JSON, который строго соответствует переданной schema.
- Не оборачивай JSON в markdown fences.
- Ключи JSON не переводи.
- Текст findings пиши на русском языке.
