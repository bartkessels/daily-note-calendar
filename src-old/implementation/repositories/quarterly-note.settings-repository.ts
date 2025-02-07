import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {SettingsAdapter} from 'src-old/domain/adapters/settings.adapter';
import {QuarterlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/quarterly-notes.periodic-note-settings';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src-old/domain/models/settings/daily-note-calendar.settings';

export class QuarterlyNoteSettingsRepository implements SettingsRepository<QuarterlyNotesPeriodicNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<QuarterlyNotesPeriodicNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        return settings.quarterlyNotes;
    }

    public async storeSettings(settings: QuarterlyNotesPeriodicNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            quarterlyNotes: settings
        });
    }
}