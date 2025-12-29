# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian plugin that provides a calendar view for navigating to periodic notes (daily, weekly, monthly, quarterly, yearly). It allows users to customize the date format using `date-fns` formatting rules.

## Build and Test Commands

```bash
npm install          # Install dependencies
npm run build        # Type-check and build the plugin
npm run dev          # Development build (watch mode)
npm run test         # Run all tests
npm run test -- path/to/file.spec.ts  # Run a single test file
npm run version      # Bump version in manifest.json and versions.json
```

## Architecture

The codebase follows a clean architecture with three main layers:

### Domain Layer (`src/domain/`)
Contains pure domain models and settings interfaces:
- `models/` - Core types like `Period`, `PeriodType`, `Note`, `Week`
- `settings/` - Settings interfaces for plugin configuration

### Infrastructure Layer (`src/infrastructure/`)
Handles external concerns (Obsidian API, file system, date parsing):
- `adapters/` - Interfaces for external services (file, note, settings)
- `obsidian/` - Obsidian-specific implementations of adapters
- `repositories/` - Data access implementations
- `parsers/` - Date parsing using date-fns
- `factories/` - Factory implementations for creating infrastructure objects

### Business Layer (`src/business/`)
Contains business logic independent of Obsidian:
- `managers/` - Core business operations (periodic note management, date management)
- `builders/` - Name builders for periodic notes
- `parsers/` - Variable parsers for template processing (`{{date:...}}`, `{{today:...}}`, `{{title}}`)
- `factories/` - Factory implementations for business objects

### Presentation Layer (`src/presentation/`)
React-based UI and Obsidian integration:
- `components/` - React components (calendar, day, week, month, etc.)
- `views/` - Obsidian view implementations
- `view-models/` - MVVM-style view models for each period type
- `services/` - Presentation services
- `commands/` - Obsidian command implementations
- `command-handlers/` - Command handler implementations
- `settings/` - Settings UI views

### Dependency Injection
Dependencies are wired manually in `src/dependencies.ts` using factory pattern. The `getDependencies()` function creates and connects all layers.

## Key Patterns

- **Factory Pattern**: Used extensively for creating managers, repositories, parsers, and view models
- **Adapter Pattern**: Obsidian-specific code is isolated behind adapter interfaces
- **MVVM**: View models manage UI state and expose observables to React components
- **Contracts**: Interfaces defined in `contracts/` directories define layer boundaries

## Testing

Tests are co-located with source files using `.spec.ts` suffix. Only business logic that doesn't depend on Obsidian is tested. Tests use Jest with ts-jest and jsdom environment.

## Branching Strategy

- `feature/<name>` - New features
- `bugfix/<name>` - Bug fixes
- `documentation/<name>` - Documentation changes
- `hotfix/<type>-<name>` - Dependency updates and quick fixes

All branches merge directly to `main`.
