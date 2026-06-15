# Iron Solver

AI automation subsystem for the forge monorepo.

## Current scope

- Project: `apps/ncottage-www`
- Direction: frontend
- Agents: developer, reviewer, QA
- Orchestration: deterministic TypeScript CLI + GitHub labels

## Architecture

```text
packages/iron-solver/  application core, use-cases, ports, routing, prompt templates
infrastructure/run_iron_solver/ composition root, adapters, project prompts, schemas, CI job
.github/workflows/          GitHub Actions shim required by GitHub
```

`@forge/iron-solver` is the reusable package. It owns the use-cases and DI
ports, but has no direct side effects.

`infrastructure/run_iron_solver` is the composition root. It wires GitHub, Git,
the selected agent runner, pnpm checks, files, clock, and project config into the core.
The current adapter is Codex; swapping to another agent means replacing the
`agent` adapter in `src/composition.ts` and, if needed, changing project `aiLabel`.

## Entry points

```bash
pnpm --dir infrastructure/run_iron_solver build
pnpm --dir infrastructure/run_iron_solver route
pnpm --dir infrastructure/run_iron_solver develop <issue-number>
pnpm --dir infrastructure/run_iron_solver review <pr-number>
pnpm --dir infrastructure/run_iron_solver qa <issue-number>
pnpm --dir infrastructure/run_iron_solver setup-labels
```

Project can be selected with env or CLI option:

```bash
AI_PROJECT_KEY=ncottage-www pnpm --dir infrastructure/run_iron_solver route
pnpm --dir infrastructure/run_iron_solver route -- --project ncottage-www
```

## Structure

```text
package.json    Iron Solver infrastructure package scripts
run.mjs         compile-and-run wrapper
src/index.ts    local/CI job entrypoint
src/job.ts      CLI argument parsing
src/composition.ts composition root
src/adapters/   side-effect adapters for core ports
src/commands/   compatibility command wrappers
projects/       project-specific role prompts
schemas/        Agent structured output schemas
workflow/       workflow documentation
runner-setup/   self-hosted runner documentation
```

GitHub workflow and issue template remain in `.github` because GitHub requires
those paths. The workflow is a thin shim; it calls this infrastructure job.

Bundling is intentionally not used yet: Iron Solver runs inside the repository
and shells out to `gh`, `git`, the selected agent CLI, `pnpm`, and Chrome.
