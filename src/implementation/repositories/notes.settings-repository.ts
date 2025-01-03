import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NotesSettings} from 'src/domain/models/settings/notes.settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src/domain/models/settings/daily-note-calendar.settings';

export class NotesSettingsRepository implements SettingsRepository<NotesSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<NotesSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        return settings.notesSettings;
    }

    public async storeSettings(settings: NotesSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            notesSettings: settings
        });
    }
}