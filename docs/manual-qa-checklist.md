# Manual QA Checklist

This checklist validates system-edge integration code that is explicitly excluded from automated testing per architectural decision: Obsidian adapters (`src/infrastructure/obsidian/*adapter.ts`) and plugin lifecycle (`src/daily-note-calendar.plugin.ts`, `src/daily-note-calendar.plugin-setting-tab.ts`).

**Why manual testing?** These components sit at the Obsidian API boundary. Mocking the Obsidian API creates brittle tests tied to implementation details that could change. Manual validation in a running Obsidian instance provides higher confidence.

---

## Pre-Release Validation

Run this checklist before every release or after changes to adapters, plugin lifecycle, or Obsidian API integration.

### Environment Setup
- [ ] Obsidian version: _________ (document version used for testing)
- [ ] Plugin version: _________ (from `manifest.json`)
- [ ] Test vault location: _________ (use dedicated test vault, not production notes)

---

## 1. Plugin Lifecycle

### 1.1 Plugin Loading
- [ ] Plugin loads without errors in Obsidian console
- [ ] No TypeScript compilation errors
- [ ] Plugin appears in Settings → Community plugins
- [ ] Plugin can be enabled/disabled without errors

### 1.2 View Registration
- [ ] Calendar view automatically opens on plugin load
- [ ] Calendar view appears in right sidebar
- [ ] Calendar view can be closed without errors
- [ ] Calendar view can be reopened by toggling plugin or restarting Obsidian

### 1.3 Command Registration
Verify all commands appear in command palette (Ctrl+P / Cmd+P):
- [ ] "Open today's note"
- [ ] "Open yesterday's note"
- [ ] "Open tomorrow's note"
- [ ] "Open weekly note"
- [ ] "Navigate to current week"
- [ ] "Navigate to next week"
- [ ] "Navigate to previous week"
- [ ] "Navigate to next month"
- [ ] "Navigate to previous month"
- [ ] "Display in calendar" (when a note is active)

---

## 2. Settings Persistence (`ObsidianSettingsAdapter`)

### 2.1 Settings Tab
- [ ] Settings tab appears under plugin settings
- [ ] All settings sections render without errors:
  - [ ] General settings
  - [ ] Display notes settings
  - [ ] Daily notes settings
  - [ ] Weekly notes settings
  - [ ] Monthly notes settings
  - [ ] Quarterly notes settings
  - [ ] Yearly notes settings

### 2.2 Settings Save/Load
- [ ] Change a setting (e.g., note folder path)
- [ ] Close Obsidian completely
- [ ] Reopen Obsidian
- [ ] Verify setting persisted correctly

### 2.3 Default Settings Fallback
- [ ] Delete plugin data file (`.obsidian/plugins/daily-note-calendar/data.json`)
- [ ] Reload plugin
- [ ] Verify default settings are applied
- [ ] Settings tab shows default values

---

## 3. File Operations (`ObsidianFileAdapter`)

### 3.1 File Existence Check
- [ ] Create a test note manually: `test-note.md`
- [ ] Open calendar, navigate to a date
- [ ] Note indicator shows correctly for days with notes
- [ ] Delete `test-note.md`
- [ ] Note indicator disappears after refresh

### 3.2 File Creation
- [ ] Click on a day without a note (with Cmd/Ctrl to create)
- [ ] Verify note is created in configured folder
- [ ] Verify note has correct name format per settings
- [ ] Verify note content matches template (if configured)

### 3.3 Folder Creation
- [ ] Configure note folder to `test-folder/subfolder` (non-existent path)
- [ ] Create a new note
- [ ] Verify folder structure is created automatically
- [ ] Note is created in correct location

### 3.4 File Opening - Current Tab
- [ ] Create or select a test note
- [ ] Click day in calendar (default click)
- [ ] Verify note opens in current tab
- [ ] Verify previous tab content is replaced

### 3.5 File Opening - Horizontal Split
- [ ] Click day with Cmd+Alt / Ctrl+Alt (or configured modifier)
- [ ] Verify note opens in horizontal split
- [ ] Verify original pane content is preserved

### 3.6 File Opening - Vertical Split
- [ ] Click day with Cmd+Shift / Ctrl+Shift (or configured modifier)
- [ ] Verify note opens in vertical split
- [ ] Verify original pane content is preserved

### 3.7 File Deletion
- [ ] Right-click on a day with a note → "Delete note"
- [ ] Verify Obsidian deletion prompt appears
- [ ] Confirm deletion
- [ ] Verify note is deleted from vault
- [ ] Verify note indicator disappears from calendar

---

## 4. Note Operations (`ObsidianNoteAdapter`)

### 4.1 Active Note Retrieval
- [ ] Open a note in editor
- [ ] Execute "Display in calendar" command
- [ ] Verify calendar navigates to correct date
- [ ] Verify correct period is selected

### 4.2 Notes Collection (Display Notes Feature)
- [ ] Create multiple notes with front matter:
  ```yaml
  ---
  created: 2026-04-08
  ---
  ```
- [ ] Click on April 8, 2026 in calendar
- [ ] Verify all notes with that creation date appear in notes panel
- [ ] Verify note names, paths, and dates display correctly

### 4.3 Front Matter Parsing
Test various front matter formats:
- [ ] `created: 2026-04-08` (ISO date)
- [ ] `created: 2026-04-08T10:30:00` (ISO datetime)
- [ ] `created: [[2026-04-08]]` (wikilink format)
- [ ] Verify all formats parse correctly
- [ ] Notes without `created` field are ignored (not shown)

### 4.4 Metadata Cache Handling
- [ ] Create note without front matter
- [ ] Add front matter with `created` field
- [ ] Without reloading Obsidian, click date in calendar
- [ ] Verify metadata cache updates and note appears
- [ ] (May require manual cache refresh depending on Obsidian version)

---

## 5. Template Resolution

### 5.1 Template File Path
- [ ] Configure template file path in settings
- [ ] Create new note from calendar
- [ ] Verify template content is inserted
- [ ] Verify variables are parsed (e.g., `{{date}}`, `{{title}}`)

### 5.2 Template Variables
Configure template with variables:
```markdown
---
created: {{date:YYYY-MM-DD}}
---
# {{title}}

Today is {{date:dddd, MMMM Do YYYY}}
```
- [ ] Create note for 2026-04-08
- [ ] Verify `{{date}}` resolves to correct format
- [ ] Verify `{{title}}` resolves correctly
- [ ] Verify all configured variables parse

### 5.3 Missing Template Handling
- [ ] Configure template path to non-existent file
- [ ] Create new note from calendar
- [ ] Verify graceful fallback (empty note or default content)
- [ ] Verify no error thrown

---

## 6. Cross-Platform Validation

### 6.1 Windows
- [ ] File paths with `\` separators work correctly
- [ ] Modifier keys (Ctrl, Alt, Shift) work as expected
- [ ] File creation/deletion works

### 6.2 macOS
- [ ] File paths with `/` separators work correctly
- [ ] Modifier keys (Cmd, Option, Shift) work as expected
- [ ] File creation/deletion works

### 6.3 Linux
- [ ] File paths with `/` separators work correctly
- [ ] Modifier keys (Ctrl, Alt, Shift) work as expected
- [ ] File creation/deletion works

---

## 7. Error Handling

### 7.1 Vault Permissions
- [ ] Make note file read-only
- [ ] Try to delete note from calendar
- [ ] Verify error message shows to user

### 7.2 Invalid Configuration
- [ ] Configure invalid date format in settings
- [ ] Try to create note
- [ ] Verify graceful error handling

### 7.3 Missing Folder
- [ ] Configure note folder that requires parent creation
- [ ] Verify parent folders created automatically

---

## 8. Performance

### 8.1 Large Vault
- [ ] Test in vault with 5000+ notes
- [ ] Verify calendar loads without significant lag
- [ ] Verify note indicators load reasonably fast
- [ ] Verify metadata cache queries don't freeze UI

### 8.2 Memory Leaks
- [ ] Open/close calendar view 50 times
- [ ] Check Obsidian memory usage (via OS task manager)
- [ ] Verify no significant memory growth

---

## 9. Regression Tests (After Obsidian Updates)

When a new Obsidian version is released:
- [ ] Verify all commands still work
- [ ] Verify all file operations work
- [ ] Verify settings persist correctly
- [ ] Check Obsidian changelog for API changes affecting:
  - `Vault` API
  - `Workspace` API
  - `MetadataCache` API
  - `TFile` / `TFolder` classes
  - Plugin lifecycle hooks

---

## Test Results

**Date:** _______________  
**Tester:** _______________  
**Obsidian Version:** _______________  
**Plugin Version:** _______________  
**Pass Rate:** _____ / _____ (total checked)  

**Failures or Issues Found:**
```
(Document any failures, unexpected behavior, or edge cases discovered)
```

**Notes:**
```
(Additional observations, suggestions, or context)
```

---

## Why This Approach?

**Automated tests cover:**
- Business logic (managers, services, repositories, parsers)
- Presentation logic (view models, command handlers, components)
- Domain models and utilities

**Manual tests cover:**
- Obsidian API integration (adapters)
- Plugin lifecycle (registration, settings tab)
- Real vault operations
- Cross-platform behavior
- Performance under load

This separation keeps automated tests fast, maintainable, and decoupled from Obsidian implementation details, while manual QA validates real-world integration correctness.
