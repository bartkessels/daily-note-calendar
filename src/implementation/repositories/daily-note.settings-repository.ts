import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DailyNoteSettings, DEFAULT_SETTINGS} from 'src/domain/models/settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';

export class DailyNoteSettingsRepository implements SettingsRepository<DailyNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<DailyNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);
        return settings.dailyNotes;
    }

    public async storeSettings(settings: DailyNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            dailyNotes: settings
        });
    }
}