import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {SettingsAdapter} from 'src-old/domain/adapters/settings.adapter';
import {MonthlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/monthly-notes.periodic-note-settings';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src-old/domain/models/settings/daily-note-calendar.settings';

export class MonthlyNoteSettingsRepository implements SettingsRepository<MonthlyNotesPeriodicNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<MonthlyNotesPeriodicNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        return settings.monthlyNotes;
    }

    public async storeSettings(settings: MonthlyNotesPeriodicNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            monthlyNotes: settings
        });
    }
}