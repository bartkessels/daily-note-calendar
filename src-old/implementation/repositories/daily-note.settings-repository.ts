import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {SettingsAdapter} from 'src-old/domain/adapters/settings.adapter';
import {DailyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/daily-notes.periodic-note-settings';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS } from 'src-old/domain/models/settings/daily-note-calendar.settings';

export class DailyNoteSettingsRepository implements SettingsRepository<DailyNotesPeriodicNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<DailyNotesPeriodicNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        return settings.dailyNotes;
    }

    public async storeSettings(settings: DailyNotesPeriodicNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            dailyNotes: settings
        });
    }
}