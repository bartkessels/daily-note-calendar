import {
    DailyNotesPeriodicNoteSettings,
    DEFAULT_DAILY_NOTES_PERIODIC_NOTE_SETTINGS
} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {
    DEFAULT_WEEKLY_NOTES_PERIODIC_SETTINGS,
    WeeklyNotesPeriodicNoteSettings
} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import {
    DEFAULT_MONTHLY_NOTES_PERIODIC_SETTINGS,
    MonthlyNotesPeriodicNoteSettings
} from 'src/domain/models/settings/monthly-notes.periodic-note-settings';
import {
    DEFAULT_QUARTERLY_NOTES_PERIODIC_NOTE_SETTINGS,
    QuarterlyNotesPeriodicNoteSettings
} from 'src/domain/models/settings/quarterly-notes.periodic-note-settings';
import {
    DEFAULT_YEARLY_NOTES_PERIODIC_NOTE_SETTINGS,
    YearlyNotesPeriodicNoteSettings
} from 'src/domain/models/settings/yearly-notes.periodic-note-settings';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/models/settings/general.settings';

export interface DailyNoteCalendarSettings {
    generalSettings: GeneralSettings,
    dailyNotes: DailyNotesPeriodicNoteSettings,
    weeklyNotes: WeeklyNotesPeriodicNoteSettings,
    monthlyNotes: MonthlyNotesPeriodicNoteSettings,
    quarterlyNotes: QuarterlyNotesPeriodicNoteSettings,
    yearlyNotes: YearlyNotesPeriodicNoteSettings,

    // Required for legacy reasons; todo: Remove these in the upcoming release
    dailyNoteNameTemplate: string,
    dailyNoteTemplateFile: string,
    dailyNotesFolder: string,
    weeklyNoteNameTemplate: string,
    weeklyNoteTemplateFile: string,
    weeklyNoteFolder: string
}

export const DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS: DailyNoteCalendarSettings = {
    generalSettings: DEFAULT_GENERAL_SETTINGS,
    dailyNotes: DEFAULT_DAILY_NOTES_PERIODIC_NOTE_SETTINGS,
    weeklyNotes: DEFAULT_WEEKLY_NOTES_PERIODIC_SETTINGS,
    monthlyNotes: DEFAULT_MONTHLY_NOTES_PERIODIC_SETTINGS,
    quarterlyNotes: DEFAULT_QUARTERLY_NOTES_PERIODIC_NOTE_SETTINGS,
    yearlyNotes: DEFAULT_YEARLY_NOTES_PERIODIC_NOTE_SETTINGS,

    // Required for legacy reasons; todo: Remove these in the upcoming release
    dailyNoteNameTemplate: 'yyyy-MM-dd - eeee',
    dailyNoteTemplateFile: 'Templates/Daily note',
    dailyNotesFolder: 'Daily notes',
    weeklyNoteNameTemplate: 'yyyy - ww',
    weeklyNoteTemplateFile: 'Templates/Weekly note',
    weeklyNoteFolder: 'Weekly notes'
}