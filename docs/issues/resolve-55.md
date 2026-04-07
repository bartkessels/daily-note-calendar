# Resolution Plan: Issue #55 — Separate Indicators for DN Presence, Non-DN Count, and Focused Day

**Issue:** https://github.com/bartkessels/daily-note-calendar/issues/55  
**Type:** Feature request / UX improvement  
**Status:** Planning

---

## Problem Statement

Three visual states currently share an overlapping, hard-to-distinguish indicator system on calendar day cells:

1. **Today** — accent text color (`#today { color: var(--text-accent) }`)
2. **Daily note presence** — thin bottom border via `.has-note::after`
3. **Selected day** — thicker accent bottom border via `.selected-day::after`

The `::after` pseudo-elements for states 2 and 3 occupy the same space, so when a day with a periodic note is selected its note indicator is visually overwritten. There is also no indicator for the number of non-daily notes created on a given calendar day.

Reporters request:
- A **border/ring** to mark the currently focused (today) date instead of text color alone
- A **dot** to indicate the presence of a daily note for a given day
- A **numeric count badge** showing how many non-daily notes were created on that day
- The count badge should be optional (off by default)

---

## Proposed Solution

### Part 1 — Restyle existing indicators (CSS-only, no logic change)

Redesign the three existing CSS states to be visually distinct and non-conflicting:

| State | Current style | Proposed style |
|---|---|---|
| Today | Accent text color | Accent ring/border around cell (keep text color) |
| Has periodic note | Thin bottom line via `::after` | Small round dot beneath the day number via `::after` (centered, circular) |
| Selected day | Thick accent bottom line via `::after` | Accent filled background or bold bottom bar — distinct from dot |

**Files affected:** `styles.css` only.

### Part 2 — Created note count indicator (new feature)

Show a small numeric badge on each day cell counting the notes created on that day. Controlled by a new setting, off by default.

#### 2a. New setting

Add `displayCreatedNoteCountIndicator: boolean` (default: `false`) to `GeneralSettings`.

**Files:**
- `src/domain/settings/general.settings.ts`

#### 2b. Business layer — note count method

Add `getNoteCountForPeriod(period: Period): Promise<number>` to the `NoteManager` interface and implement it in `RepositoryNoteManager` by reusing the existing filtering logic (the implementation returns `notes.length` from the same filtered set used by `getNotesForPeriod`).

**Files:**
- `src/business/contracts/note.manager.ts`
- `src/business/managers/repository.note-manager.ts`
- `src/business/managers/repository.note-manager.spec.ts` (new test case)

> **Architectural note for Architect review:** We reuse the same filtering logic from `getNotesForPeriod` rather than duplicating it. The count respects `displayNotesCreatedOnDate` — if note listing is disabled, return 0. This keeps the setting semantics consistent.

#### 2c. Presentation contract — day-specific view model interface

Introduce a `DayNoteViewModel` interface that extends `PeriodNoteViewModel` with the additional method:

```ts
export interface DayNoteViewModel extends PeriodNoteViewModel {
    getNoteCount(period: Period): Promise<number>;
}
```

This scopes the count capability to day cells only, without polluting the base `PeriodNoteViewModel` interface shared by week/month/quarter/year periods.

**Files:**
- `src/presentation/contracts/day.view-model.ts` (new file)

#### 2d. Presentation — DayPeriodNoteViewModel

Implement `DayNoteViewModel` in `DayPeriodNoteViewModel`:
- Inject `NoteService` (presentation-layer contract, already wired in `getDependencies`) into `DayPeriodNoteViewModel`
- `getNoteCount(period)` checks `displayCreatedNoteCountIndicator`; returns 0 if off, otherwise delegates to `noteService.getNotesForPeriod(period).then(notes => notes.length)`

**Files:**
- `src/presentation/view-models/day.period-note-view-model.ts`
- Update wiring in `src/dependencies.ts` to pass `noteService` to `DayPeriodNoteViewModel`

#### 2e. Presentation — DailyNoteComponent

- Add `noteCount` state: `const [noteCount, setNoteCount] = React.useState<number>(0);`
- Call `viewModel?.getNoteCount(props.day).then(setNoteCount)` alongside the existing `hasPeriodicNote` call
- Pass `noteCount` to `PeriodComponent`

**Files:**
- `src/presentation/components/day.component.tsx`

#### 2f. Presentation — PeriodComponent

- Add `noteCount?: number` to `PeriodComponentProperties`
- When `noteCount > 0`, render a `<span className="note-count">{noteCount}</span>` badge inside the day cell
- CSS handles the visual placement (absolute-positioned badge in corner or below day number)

**Files:**
- `src/presentation/components/period.component.tsx`
- `styles.css` (add `.note-count` badge style)

#### 2g. Settings UI

Add a toggle for `displayCreatedNoteCountIndicator` in the general settings panel.

**Files:**
- Relevant file in `src/presentation/settings/`

---

## Open Architectural Questions (for Architect review)

1. **NoteService vs NoteManager in DayPeriodNoteViewModel:** `NoteService` is the existing presentation-layer abstraction and is already instantiated in `getDependencies`. Using it avoids leaking a business-layer contract into the presentation view model. Is this the right boundary?

2. **Reuse vs separate count method:** Should `getNoteCountForPeriod` be a first-class method on `NoteManager`, or should the view model simply call `getNotesForPeriod` and count the array? A dedicated method avoids fetching full `Note` objects just to count them, but adds surface area to the interface.

3. **DayNoteViewModel interface scope:** Is a separate `DayNoteViewModel` interface the right choice to avoid adding `getNoteCount` to the shared `PeriodNoteViewModel`, or is there a better pattern already in use?

4. **Count includes or excludes periodic notes:** The `getNotesForPeriod` in `RepositoryNoteManager` already applies the `displayNotesCreatedOnDate` flag and filters by the existing note repository logic. The count should reflect exactly what would appear in the notes panel below the calendar (i.e., exclude periodic notes since those are managed separately). Confirm this is the correct semantic.

---

## Implementation Order

1. CSS restyling (Part 1) — standalone, no logic changes, fast to ship
2. `GeneralSettings` extension + `NoteManager` count method + `RepositoryNoteManager` impl + tests
3. `DayNoteViewModel` interface + `DayPeriodNoteViewModel` update + `dependencies.ts` wiring
4. `DailyNoteComponent` + `PeriodComponent` updates
5. Settings UI toggle

---

## Non-Goals

- Count indicators on week/month/quarter/year cells (out of scope for this issue)
- Changing the visual language for any periodic note type other than daily notes
- Modifying how notes are fetched or sorted for the notes panel below the calendar
- Any change to the settings persistence shape beyond adding one boolean field

---

## Architect Decisions

> Recorded after Architect review. These decisions supersede the original open questions.

### Q1 — NoteService vs NoteManager: **Use `NoteService`**
`NoteManager` is a business-layer contract. Injecting it into a view model crosses the layer boundary. `DefaultNotesViewModel` already sets the correct precedent — it receives `NoteService`, not `NoteManager`. Follow this pattern: inject `NoteService` into `DayPeriodNoteViewModel`.

### Q2 — Dedicated count method: **Drop `getNoteCountForPeriod` from `NoteManager`**
Do not add `getNoteCountForPeriod` to the `NoteManager` interface. Counting in the view model via `noteService.getNotesForPeriod(period).then(notes => notes.length)` is sufficient at plugin scale, keeps the business contract clean, and ensures the badge count is always semantically consistent with the notes panel.

**Impact on plan:** Remove section 2b (dedicated method). The `NoteManager` and `RepositoryNoteManager` are untouched by this feature.

### Q3 — `DayNoteViewModel` interface: **Introduce it, and update context types**
A `DayNoteViewModel extends PeriodNoteViewModel` interface with `getNoteCount` is the right scope. The plan was missing a required change: `ViewModelsContext.dailyNoteViewModel` and `useDailyNoteViewModel()` must both be re-typed from `PeriodNoteViewModel` to `DayNoteViewModel`. Without this, the build fails at the component layer.

**Additional file:** `src/presentation/context/view-model.context.ts`

### Q4 — Count semantics: **Exactly matches notes panel**
The badge count equals `getNotesForPeriod` length. Because `getNotesForPeriod` gates on `displayNotesCreatedOnDate`, the badge will silently show 0 when that setting is off even if `displayCreatedNoteCountIndicator` is on. This is not a defect but must be called out explicitly in the settings UI description for the new toggle.

### Architect extra: **Fix the `useEffect` anti-pattern**
The existing `DailyNoteComponent` fires `viewModel?.hasPeriodicNote(...).then(...)` in the render body — a React violation. Do not replicate this for `getNoteCount`. Both calls must be moved inside a `useEffect` with `[props.day, viewModel]` dependencies. The developer assigned to step 4 must fix both as part of this work.

---

## Revised Change Set

| Step | Scope | Files |
|---|---|---|
| 1 | CSS restyling | `styles.css` |
| 2 | New setting | `src/domain/settings/general.settings.ts` |
| 3 | `DayNoteViewModel` interface | `src/presentation/contracts/day.view-model.ts` (new) |
| 4 | Update `ViewModelsContext` types | `src/presentation/context/view-model.context.ts` |
| 5 | Implement `DayPeriodNoteViewModel.getNoteCount` + inject `NoteService` | `src/presentation/view-models/day.period-note-view-model.ts` |
| 6 | Wire `noteService` into `DayPeriodNoteViewModel` | `src/dependencies.ts` |
| 7 | Update `DailyNoteComponent` with `useEffect` + `noteCount` state | `src/presentation/components/day.component.tsx` |
| 8 | Add `noteCount` prop + badge render | `src/presentation/components/period.component.tsx` |
| 9 | Settings toggle UI | `src/presentation/settings/` |
