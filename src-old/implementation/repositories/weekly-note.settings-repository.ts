import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {SettingsAdapter} from 'src-old/domain/adapters/settings.adapter';
import {WeeklyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/weekly-notes.periodic-note-settings';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src-old/domain/models/settings/daily-note-calendar.settings';

export class WeeklyNoteSettingsRepository implements SettingsRepository<WeeklyNotesPeriodicNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<WeeklyNotesPeriodicNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        return settings.weeklyNotes;
    }

    public async storeSettings(settings: WeeklyNotesPeriodicNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            weeklyNotes: settings
        });
    }
}