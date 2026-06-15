# ncottage-www AI project

Project-specific AI automation for `apps/ncottage-www`.

## Routing labels

- `frontend`
- `ai:codex`
- `project:ncottage-www`

## Orchestration

Routing and status transitions are handled by the deterministic TypeScript CLI in
`infrastructure/run_iron_solver/src`. There is no LLM orchestrator agent in the MVP.

## AI roles

- `frontend-developer`
- `frontend-reviewer`
- `frontend-qa`

Each role folder contains:

- `prompt.md` — Russian canonical prompt used by the TypeScript CLI.

The CLI reads `prompt.md`.

## Branch naming

AI branches use:

```text
ai/ncottage-www-<issue-number>
```

## Human gates

- `status:ready-for-human-code-review` blocks AI QA until a human reviews the PR.
- Add `status:ready-for-test` to the issue after approving the code.
- `status:ready-for-human-final-review` means AI QA passed and the PR is ready for final human review.
