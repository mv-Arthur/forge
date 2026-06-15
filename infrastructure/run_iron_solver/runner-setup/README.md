# Self-hosted runner setup

## Runner

Create a GitHub self-hosted runner for this repo:

1. GitHub repo settings -> Actions -> Runners -> New self-hosted runner.
2. Pick macOS.
3. Follow the generated install commands.
4. Add custom label `forge-ai`.
5. Start the runner on the machine that can run Codex and Chrome.

## Required secrets

Add repository secrets:

- `OPENAI_API_KEY` — API key used by Codex in non-interactive runs.
- `AI_GITHUB_TOKEN` — fine-grained PAT for the AI bot/user.

`AI_GITHUB_TOKEN` needs access to:

- contents: read/write
- issues: read/write
- pull requests: read/write
- metadata: read

Use a PAT instead of the default `GITHUB_TOKEN`, because workflow actions caused
by `GITHUB_TOKEN` usually do not trigger follow-up workflow runs.

## Required local tools

Install on the runner host:

```bash
npm install -g @openai/codex
brew install gh
corepack enable
```

The TypeScript AI CLI is compiled from repo dependencies during workflow runs,
so the runner does not need a global TypeScript install.

Chrome should be available at the standard macOS path:

```text
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

## Initial labels

After pushing the workflow, run once:

```bash
GH_TOKEN=<AI_GITHUB_TOKEN> pnpm --dir infrastructure/run_iron_solver setup-labels
```

## First test

1. Create an issue from `Frontend AI task`.
2. Fill acceptance criteria and QA scenarios.
3. Add labels `frontend`, `ai:codex`, `project:ncottage-www`,
   `status:ready-for-develop`.
4. Watch `Iron Solver` in GitHub Actions.
5. When the task reaches `status:ready-for-human-code-review`, review the PR.
6. If the code is approved, add `status:ready-for-test` to the issue to start AI QA.
7. When the task reaches `status:ready-for-human-final-review`, do the final check and merge manually.

If the workflow gets stuck, add `status:needs-human-attention` and inspect the
uploaded artifact from the failed job.
