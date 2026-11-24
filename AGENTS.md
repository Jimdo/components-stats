# components-stats

This file is the source of truth for AI assistant guidance in this repository. `CLAUDE.md` is a symlink to this file so that Claude Code, Codex, Copilot, and other agents share the same rules.

CLI and library that clones every repo in a GitHub org that depends on a given npm package and runs react-scanner over them to count component and prop usage. Published to npm as `@jimdo/components-stats` by `release.yml` on push to `main`.

## Run it

```sh
npm ci
cp config.example config.json   # set org, pkgName, ghAuthToken (PAT with the repo scope); daysUntilStale and components are optional
npm start                       # clean, build, then node build/run.js reads ./config.json
```

Node 24.15.0 and npm 12.1.0 (`volta` in package.json; CI installs that npm because `allowScripts` is only enforced by npm 12). Clones use `git@github.com:` URLs, so you need SSH access to the org. A run writes `repositories/`, `pkgAdoption.json`, `reports_by_repo-<pkg>/` and `reports_by_repo-<pkg>-raw/` into the current directory, all gitignored. It takes a long time on a real org.

## Test it

```sh
npm test               # vitest run --coverage over test/**/*.spec.ts
npm run typecheck      # tsc --noEmit
npm run check          # biome check --write ./src/ (rewrites files)
```

The only spec is `test/buildScannerConfig.spec.ts`: it checks the react-scanner config built for a root install and for a subdirectory install, with and without a `components` filter. CI on a PR (`pr.yml`, job `build`) runs `npm ci`, `npm run build`, `npm test` and a Codecov upload; it does not run biome or `typecheck`. Required to merge on `main`: the `build` check, one approving review and signed commits (branch protection plus the repo ruleset). The husky pre-commit hook runs lint-staged (biome on staged `.ts`) and `vitest run`; `prepare-commit-msg` opens commitizen.

## Not covered

- `scanOrg` in `src/index.ts`, `cloneReposList.ts` (git clone and pull through shelljs) and `run.ts` (config.json parsing) have no tests. Nothing runs react-scanner or package-adoption against a real repo, locally or in CI.
- Biome only runs in the pre-commit hook, so a commit made with the hook skipped reaches CI unlinted. CI's `npm run build` type-checks `src/` only; `test/` and `repo-scripts/` are type-checked by nothing but a manual `npm run typecheck`.
- The published tarball (`files: build/**`, bundled react-scanner and typescript) is never inspected before `npm publish`.

## Where to be careful

- `typescript` sits in `dependencies`, pinned to the exact version react-scanner 1.2.0 depends on (5.6.2 today), and both are in `bundleDependencies` so they dedupe into one bundled copy. Any bump, even a patch, splits them into two copies and doubles the tarball. `dependabot.yml` ignores `typescript` for this reason. Move it only when react-scanner moves, and to the version react-scanner pins.
- Merging to `main` is the release. `release.yml` runs `repo-scripts/npm-release.ts`, which publishes whenever the `package.json` version is not on the registry yet. The script is named `semantic-release`, yet nothing derives the version from commits: bump it by hand with `npm version`, whose `postversion` pushes the `v<version>` tag. The dist-tag comes from the version suffix and branch name; `main` publishes `latest`.
- `config.json` holds a GitHub token. It is gitignored. Do not log it or copy it into a fixture.
- A failed clone or pull is logged and skipped, so a repo can silently drop out of the report. `reports_by_repo-<pkg>/` is wiped before each run.
- The package is ESM (`"type": "module"`). Relative imports need the `.js` suffix at runtime; `./types` gets away without it only because it is imported for types alone.
- The `overrides` block (picomatch, glob, minimatch) exists for open advisories. Removing it brings them back.

## Before you merge a bump

- `typescript`: do not bump on its own. If react-scanner moved, read its `typescript` pin in `package-lock.json` under `node_modules/react-scanner`, set `dependencies.typescript` to exactly that, and check `npm ls typescript` shows one copy with no `node_modules/react-scanner/node_modules/typescript`.
- `react-scanner`, `package-adoption` (pinned exact), `shelljs`: run `npm start` with a real `config.json` against a small org and compare a report file with the previous run. Run `npm pack --dry-run` and look at the tarball size and file list.
- `vitest`, `@vitest/coverage-v8`, `@biomejs/biome`, `lint-staged`, `husky`, `tsx`, `type-fest`, `@types/node`, commitizen: `npm ci && npm test && npm run typecheck && npm run check`. A biome bump can change what `organizeImports` wants; commit what `npm run check` rewrites.
- GitHub Actions (monthly, SHA pinned): check the version comment next to each SHA still matches the tag.
- Node or npm in `volta` / `engines`: keep `volta.npm` on 12.x or `allowScripts` stops being enforced.
- Agents: if you could not run a check, write it under "Needs a human" in the PR instead of claiming it.
