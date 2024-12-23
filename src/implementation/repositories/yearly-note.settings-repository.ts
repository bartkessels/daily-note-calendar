import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {YearlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/yearly-notes.periodic-note-settings';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src/domain/models/settings/daily-note-calendar.settings';

export class YearlyNoteSettingsRepository implements SettingsRepository<YearlyNotesPeriodicNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<YearlyNotesPeriodicNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        return settings.yearlyNotes;
    }

    public async storeSettings(settings: YearlyNotesPeriodicNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            yearlyNotes: settings
        });
    }
}