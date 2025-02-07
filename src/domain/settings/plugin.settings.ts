import {DEFAULT_DISPLAY_NOTES_SETTINGS, DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/settings/general.settings';
import {Settings} from 'src/domain/settings/settings';
import {
    DEFAULT_DAILY_NOTE_SETTINGS,
    DEFAULT_MONTHLY_NOTE_SETTINGS, DEFAULT_QUARTERLY_NOTE_SETTINGS,
    DEFAULT_WEEKLY_NOTE_SETTINGS,
    DEFAULT_YEARLY_NOTE_SETTINGS,
    PeriodNoteSettings
} from 'src/domain/settings/period-note.settings';

export interface PluginSettings extends Settings {
    generalSettings: GeneralSettings,
    notesSettings: DisplayNotesSettings,
    dailyNotes: PeriodNoteSettings,
    weeklyNotes: PeriodNoteSettings,
    monthlyNotes: PeriodNoteSettings,
    quarterlyNotes: PeriodNoteSettings,
    yearlyNotes: PeriodNoteSettings
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
