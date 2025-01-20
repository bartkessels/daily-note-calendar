import {DEFAULT_DISPLAY_NOTES_SETTINGS, DisplayNotesSettings} from 'src-new/domain/settings/display-notes.settings';
import {DailyNoteSettings, DEFAULT_DAILY_NOTE_SETTINGS} from 'src-new/domain/settings/daily-note.settings';
import {DEFAULT_WEEKLY_NOTE_SETTINGS, WeeklyNoteSettings} from 'src-new/domain/settings/weekly-note.settings';
import {DEFAULT_MONTHLY_NOTE_SETTINGS, MonthlyNoteSettings} from 'src-new/domain/settings/monthly-note.settings';
import {DEFAULT_QUARTERLY_NOTE_SETTINGS, QuarterlyNoteSettings} from 'src-new/domain/settings/quarterly-note.settings';
import {DEFAULT_YEARLY_NOTE_SETTINGS, YearlyNoteSettings} from 'src-new/domain/settings/yearly-note.settings';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src-new/domain/settings/general.settings';
import {Settings} from 'src-new/domain/settings/settings';

export interface PluginSettings extends Settings {
    generalSettings: GeneralSettings,
    notesSettings: DisplayNotesSettings,
    dailyNotes: DailyNoteSettings,
    weeklyNotes: WeeklyNoteSettings,
    monthlyNotes: MonthlyNoteSettings,
    quarterlyNotes: QuarterlyNoteSettings,
    yearlyNotes: YearlyNoteSettings
}

export const DEFAULT_PLUGIN_SETTINGS: PluginSettings = {
    generalSettings: DEFAULT_GENERAL_SETTINGS,
    notesSettings: DEFAULT_DISPLAY_NOTES_SETTINGS,
    dailyNotes: DEFAULT_DAILY_NOTE_SETTINGS,
    weeklyNotes: DEFAULT_WEEKLY_NOTE_SETTINGS,
    monthlyNotes: DEFAULT_MONTHLY_NOTE_SETTINGS,
    quarterlyNotes: DEFAULT_QUARTERLY_NOTE_SETTINGS,
    yearlyNotes: DEFAULT_YEARLY_NOTE_SETTINGS
}
