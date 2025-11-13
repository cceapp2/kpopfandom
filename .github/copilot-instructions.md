<!--
Guidance for AI coding agents working in the `kpopfandom` repository.
This file is intentionally short and limited to patterns discoverable in the
repo and the development environment. If you need more context, ask the
maintainer before making non-trivial design decisions.
-->

# Copilot / AI Agent Instructions — kpopfandom

- **Repo snapshot (discoverable):** This repository currently contains only `README.md` at the project root. There is no build tooling, tests, or source code yet.
- **Branch & workflow:** Default branch is `main`. Create feature branches and open PRs against `main` for non-trivial changes.

- **Primary files to inspect:**
  - `README.md` — project entry; update when adding major features or instructions.

- **Dev environment (discoverable from container instructions):** Ubuntu 24.04 dev container. Common CLI tools available in the environment include `git`, `gh`, `docker`, `kubectl`, `curl`, `wget`, and standard Unix utilities. When adding automation, target these tools as available without additional container setup.

- **How to behave when repository is minimal:**
  - If a requested change requires adding source code, tests, or CI configs, **propose** the file list and a short rationale in the PR description first.
  - Do not infer undocumented architecture; instead, add a brief architecture note under `doc/` or update `README.md` describing your assumptions.

- **Merging / updating existing `copilot-instructions` file:**
  - Preserve any human-authored prose. Insert or update sections only when you can reference concrete, discoverable files or environment facts.
  - When merging, add a small changelog header with a one-line rationale and date.

- **Search patterns an agent should use when exploring the repo:**
  - `**/README.md`, `**/*.md` — find docs and human guidance
  - `**/.github/**` — CI and contributor docs
  - `**/*.(py|js|ts|go|java)` — language hints if code exists later

- **If adding build/test tooling:**
  - Add a minimal `README.md` section that documents exact commands to run locally (examples: `make test`, `pytest -q`, `npm test`).
  - Add CI workflow under `.github/workflows/` that mirrors the local commands; keep workflow names explicit (e.g., `ci-tests.yml`).

- **Integration and external dependencies:**
  - No external services or dependencies are discoverable yet. If you add integrations (APIs, databases), add a `doc/integrations.md` with env var names, required credentials, and a short local-run recipe.

- **When unsure, ask:**
  - Before adding opinionated structure (frameworks, packages, or CI), open an issue or ask the maintainer in PR comments describing tradeoffs and preferred options.

---
If any part of this guidance is unclear or you want more detail (for example, a recommended CI template or a starter project layout), tell me which direction you prefer and I will iterate.
