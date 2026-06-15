{{agentPrompt}}

Ты ревьюишь PR #{{prNumber}} проекта {{projectKey}} относительно base branch {{baseBranch}}.

Project root:
{{projectRoot}}

Issue JSON:
{{issueJson}}

PR JSON:
{{prJson}}

Diff:
{{diff}}

Верни JSON, который строго соответствует переданной schema.
Не оборачивай JSON в markdown fences.
Ключи JSON не переводи.
Текст findings пиши на русском языке.
Используй result `"fail"` только для blocking findings, которые developer должен исправить до QA.
Используй result `"pass"`, если blocking findings нет.
