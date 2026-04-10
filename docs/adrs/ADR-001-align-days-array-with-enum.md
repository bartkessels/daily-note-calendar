# ADR-001: Align days array with DayOfWeek enum order

**Date:** 2026-04-10  
**Status:** Accepted (Implemented)

## Context

The `DefaultCalendarViewModel.buildWeekDays()` method constructs an array of day labels for the calendar header based on the user's `firstDayOfWeek` preference. The method rotates a hardcoded array of day strings to place the selected first day at index 0.

**Original implementation:**
```typescript
private buildWeekDays(firstDayOfWeek: DayOfWeek): string[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const startIndex = (firstDayOfWeek - 1 + 7) % 7;
    return [...days.slice(startIndex), ...days.slice(0, startIndex)];
}
```

**Problem:**
- Mutation testing revealed that changing `+ 7` to `- 7` in the startIndex calculation survived (mutant #527), indicating unclear arithmetic and insufficient test coverage
- The formula `(firstDayOfWeek - 1 + 7) % 7` requires readers to understand modular arithmetic to verify correctness
- The array order `['Mon', 'Tue', ...]` does not align with the `DayOfWeek` enum order (`Sunday = 0, Monday = 1, ...`), requiring offset calculation

**DayOfWeek enum:**
```typescript
export enum DayOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}
```

**Architectural constraint:**
The `DayOfWeek` enum values directly align with `date-fns` library conventions. The `weekStartsOn` option in date-fns functions (`startOfWeek`, `endOfWeek`, `getWeek`) expects:
- `0` = Sunday
- `1` = Monday
- `2` = Tuesday
- ...
- `6` = Saturday

This is visible in [date-fns.date-repository.ts](../../src/infrastructure/repositories/date-fns.date-repository.ts):
```typescript
const firstDayOfWeek = startOfWeek(date, {weekStartsOn: startOfWeekDay});
```

The `DayOfWeek` enum is passed directly to date-fns without transformation, establishing Sunday = 0 as a core architectural convention driven by the dependency layer.

## Decision

**Reorder the `days` array to match the `DayOfWeek` enum order**, eliminating the need for arithmetic offset calculation.

```typescript
private buildWeekDays(firstDayOfWeek: DayOfWeek): string[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return [...days.slice(firstDayOfWeek), ...days.slice(0, firstDayOfWeek)];
}
```

## Rationale

### Why this approach:

1. **Eliminates arithmetic complexity**: The enum value directly indexes the array with zero calculation
2. **Self-documenting**: The relationship between `DayOfWeek` enum values and array indices is immediately obvious
3. **Mutation-resistant**: Direct indexing eliminates arithmetic operations that could be mutated without test failure
4. **Maintainable**: Future developers can understand the pattern without studying modular arithmetic
5. **Correct by construction**: The alignment prevents entire classes of off-by-one errors
6. **Type-safe**: The `DayOfWeek` enum is the single source of truth; impossible to introduce Monday/Sunday indexing mismatches
7. **Dependency alignment**: The Sunday-first array order matches the `date-fns` library's `weekStartsOn` convention, creating consistency between the infrastructure layer (DateFnsDateRepository) and presentation layer (CalendarViewModel)

### Alternatives considered:

**A. Simplified modular arithmetic: `(firstDayOfWeek + 6) % 7`**
- Pros: Marginally clearer than `(firstDayOfWeek - 1 + 7) % 7`
- Cons: Still requires understanding modular arithmetic; doesn't eliminate mutation testing concerns

**B. Explicit lookup table**
- Pros: Very explicit mapping
- Cons: Verbose; introduces maintenance overhead if the days array changes; harder to maintain synchronization

**C. Keep current approach with better tests**
- Pros: No code change
- Cons: Does not address root cause (unnecessary complexity); mutation survivor remains a symptom

**D. Keep Monday-first array with simplified arithmetic**
- Pros: Array order may feel more "natural"
- Cons: Requires `(firstDayOfWeek + 6) % 7` to handle Sunday wrap-around; doesn't eliminate the mutation testing issue; creates inconsistency with date-fns conventions

## Consequences

### Positive:
- Zero arithmetic in the calculation path
- Direct enum-to-index mapping is self-validating
- Mutation testing will have fewer opportunities to introduce surviving mutants
- Code review and maintenance is simpler
- Aligns with the established enum contract
- Type safety enforced by the enum definition
- **Cross-layer consistency**: The Sunday = 0 convention flows consistently from the date-fns dependency through the domain enum to the presentation array, reducing cognitive overhead when navigating between layers

### Negative:
- The array order `['Sun', 'Mon', ...]` may feel less "natural" to developers expecting Monday-first ordering
- Existing code readers familiar with the old formula will need to understand the change
- Test comments referencing the old formula must be updated to prevent future confusion

### Neutral:
- **No public API or user-facing behavior changes**; this is an internal private method refactor only
- No performance impact (negligible at this scale)
- Test expectations remain unchanged (output order is still driven by `firstDayOfWeek` setting)

## Affected Components

- [src/presentation/view-models/default.calendar-view-model.ts](../../src/presentation/view-models/default.calendar-view-model.ts) (lines 94-98)
- [src/presentation/view-models/default.calendar-view-model.spec.ts](../../src/presentation/view-models/default.calendar-view-model.spec.ts) (test comments require cleanup at lines 196, 211, 226)

## References

- DayOfWeek enum: [src/domain/models/week.ts](../../src/domain/models/week.ts)
- date-fns weekStartsOn usage: [src/infrastructure/repositories/date-fns.date-repository.ts](../../src/infrastructure/repositories/date-fns.date-repository.ts)
- Architectural consultation: Confirmed this is a presentation-layer concern aligned with infrastructure layer conventions
