# Daily Note Calendar

This repository is an Obsidian plugin that adds a calendar view for navigating daily, weekly, monthly, quarterly, and yearly notes. It supports customizable note names and folders, template variable parsing, and listing notes created on a selected date.

## Tech Stack

- TypeScript 5 with React 19
- Obsidian plugin API and Obsidian view/settings lifecycle
- esbuild for bundling to `main.js`
- Jest + ts-jest + jsdom for tests
- `date-fns` for date formatting and date logic

## Build And Validation

- Install dependencies with `npm install`
- Use `npm run dev` for watch-mode bundling
- Use `npm run build` for production validation and type-checking
- Use `npm run test` for automated tests
- There is no dedicated lint script in `package.json`; do not assume ESLint is part of the normal workflow

## Architecture Rules

- Preserve the layered structure in `src/domain`, `src/business`, `src/infrastructure`, and `src/presentation`
- Keep domain and business logic independent from React and Obsidian APIs
- Keep Obsidian-specific code in infrastructure adapters, presentation views, commands, settings, or plugin bootstrap code
- Prefer fixing behavior in managers, services, repositories, or view models instead of adding logic directly inside React components
- Respect the existing manual dependency composition in `src/dependencies.ts`; dependencies are wired explicitly through factories and constructors

## Project Structure

- `src/daily-note-calendar.plugin.ts`: plugin entry point, view registration, command registration, startup lifecycle
- `src/dependencies.ts`: root composition of factories, managers, services, adapters, and view models
- `src/domain`: core models and settings contracts
- `src/business`: pure business rules, managers, builders, parsers, and factory contracts
- `src/infrastructure`: repositories, parsers, factories, and Obsidian-backed adapters
- `src/presentation`: commands, services, view models, React components, views, and settings UI
- `src/extensions/extensions.ts`: project-wide `String` and `Date` prototype extensions already relied on by the codebase
- `src/test-helpers`: reusable mocks for tests

## Coding Conventions

- Follow the existing naming style: dotted file names such as `default.note-service.ts`, `repository.note-manager.ts`, and `calendar.view.tsx`
- Use PascalCase for classes, interfaces, enums, and React components; use camelCase for functions, methods, and variables
- Match the current code style in the touched file; do not reformat unrelated code
- Prefer explicit interfaces and constructor injection over hidden global state
- Keep React components thin and presentation-focused; view models and services should own behavior and state transitions
- Reuse existing factories, repositories, services, and adapters before introducing new abstractions
- Do not import Obsidian APIs into business or domain files just because it is convenient
- Be careful with the prototype extensions in `src/extensions/extensions.ts`; if you change them, validate all downstream usage

## Obsidian-Specific Guidance

- Treat the plugin lifecycle (`onload`, view registration, settings registration, vault events) as the integration boundary with Obsidian
- Prefer routing vault and note operations through the existing adapter and repository layers instead of calling `app.vault` directly from unrelated layers
- Keep commands aligned with the current command-handler and view-model flow instead of embedding feature logic inside command classes

## Testing Expectations

- Add or update co-located `*.spec.ts` tests when changing business logic, factories, parsers, repositories, services, or extensions
- Use the existing mocks in `src/test-helpers` instead of building ad hoc test doubles when possible
- Focus tests on observable behavior and regression coverage, especially for date calculations, note naming, variable parsing, and note-opening flows
- If a change depends on live Obsidian behavior that is hard to unit test, still run `npm run build` and document the limitation in the final response

## Working Guidance For Agents

- Start by reading the nearby factory, contract, and spec files before introducing a new pattern
- Keep changes small and consistent with the current architecture; avoid broad refactors unless the task requires them
- Update documentation when behavior, commands, settings, or user-facing flows change
- Note that `src/daily-note-calendar.plugin.ts` currently contains a TODO for reacting to settings changes; do not assume settings propagation is already complete
