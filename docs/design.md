# Design Decisions

This document captures architectural and design decisions made during development of the Daily Note Calendar plugin.

## Decision Records

### DR-001: Folder paths are not parsed through date-fns

**Date:** 2024-12-01

**Context:**
The `PeriodNameBuilder` was passing folder paths through `date-fns format()` to allow date-based folder structures. However, this caused a bug where literal folder names containing characters that are date-fns format tokens (like `e`, `o`, `s` in the word "notes") would be mangled.

For example, a folder path `Periodic/daily/notes` would become `Periodic/daily/` because:
- `e` is interpreted as day of week
- `o` is interpreted as ordinal modifier
- `s` is interpreted as seconds

This resulted in "Could not open note" errors because notes were being created in the wrong folder.

**Decision:**
Folder paths are now treated as literal strings and are not passed through the date parser. Only the file name template is parsed for date formatting.

**Consequences:**
- Users cannot use date format tokens in folder paths (e.g., `daily/yyyy/MM` for year/month subfolders)
- Users who need date-based organization can include date patterns in the file name template instead (e.g., `yyyy/MM/yyyy-MM-dd`)
- Literal folder names with any characters now work correctly

**Related files:**
- `src/business/builders/period.name-builder.ts`
