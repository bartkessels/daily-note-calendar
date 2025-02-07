import {
    DailyNotesPeriodicNoteSettings,
    DEFAULT_DAILY_NOTES_PERIODIC_NOTE_SETTINGS
} from 'src-old/domain/models/settings/daily-notes.periodic-note-settings';
import {
    DEFAULT_WEEKLY_NOTES_PERIODIC_SETTINGS,
    WeeklyNotesPeriodicNoteSettings
} from 'src-old/domain/models/settings/weekly-notes.periodic-note-settings';
import {
    DEFAULT_MONTHLY_NOTES_PERIODIC_SETTINGS,
    MonthlyNotesPeriodicNoteSettings
} from 'src-old/domain/models/settings/monthly-notes.periodic-note-settings';
import {
    DEFAULT_QUARTERLY_NOTES_PERIODIC_NOTE_SETTINGS,
    QuarterlyNotesPeriodicNoteSettings
} from 'src-old/domain/models/settings/quarterly-notes.periodic-note-settings';
import {
    DEFAULT_YEARLY_NOTES_PERIODIC_NOTE_SETTINGS,
    YearlyNotesPeriodicNoteSettings
} from 'src-old/domain/models/settings/yearly-notes.periodic-note-settings';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src-old/domain/models/settings/general.settings';
import {DEFAULT_NOTES_SETTINGS, NotesSettings} from 'src-old/domain/models/settings/notes.settings';

export interface DailyNoteCalendarSettings {
    generalSettings: GeneralSettings,
    notesSettings: NotesSettings,
    dailyNotes: DailyNotesPeriodicNoteSettings,
    weeklyNotes: WeeklyNotesPeriodicNoteSettings,
    monthlyNotes: MonthlyNotesPeriodicNoteSettings,
    quarterlyNotes: QuarterlyNotesPeriodicNoteSettings,
    yearlyNotes: YearlyNotesPeriodicNoteSettings
}

export const DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS: DailyNoteCalendarSettings = {
    generalSettings: DEFAULT_GENERAL_SETTINGS,
    notesSettings: DEFAULT_NOTES_SETTINGS,
    dailyNotes: DEFAULT_DAILY_NOTES_PERIODIC_NOTE_SETTINGS,
    weeklyNotes: DEFAULT_WEEKLY_NOTES_PERIODIC_SETTINGS,
    monthlyNotes: DEFAULT_MONTHLY_NOTES_PERIODIC_SETTINGS,
    quarterlyNotes: DEFAULT_QUARTERLY_NOTES_PERIODIC_NOTE_SETTINGS,
    yearlyNotes: DEFAULT_YEARLY_NOTES_PERIODIC_NOTE_SETTINGS
}