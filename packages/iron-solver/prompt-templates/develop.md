{{agentPrompt}}

Ты работаешь в репозитории forge.

Project:
{{projectKey}}

Project root:
{{projectRoot}}

Issue:
{{issueUrl}}

Issue title:
{{issueTitle}}

Issue JSON:
{{issueJson}}

Existing PR JSON, если он уже есть:
{{prJson}}

## Задача

- Реализуй issue или исправь последние review/QA замечания.
- Держи изменения в рамках {{projectRoot}}.
- Не выполняй push, не создавай PR, не редактируй labels и не комментируй GitHub; wrapper script сделает это сам.
- Запусти релевантные local checks, если это практично.
- Заверши работу кратким summary и verification notes на русском языке.
- Код, имена переменных, имена файлов, commit messages и PR titles пиши на английском.
