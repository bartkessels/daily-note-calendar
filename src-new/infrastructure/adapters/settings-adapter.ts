import {DailyNoteCalendarSettings} from 'src/domain/models/settings/daily-note-calendar.settings';

export interface SettingsAdapter {
    getSettings(defaultSettings: DailyNoteCalendarSettings): Promise<DailyNoteCalendarSettings>
    storeSettings(settings: DailyNoteCalendarSettings): Promise<void>;
}