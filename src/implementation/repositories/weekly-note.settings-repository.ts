import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DEFAULT_SETTINGS, WeeklyNoteSettings} from 'src/domain/models/settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';

export class WeeklyNoteSettingsRepository implements SettingsRepository<WeeklyNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<WeeklyNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);
        return settings.weeklyNotes;
    }

    public async storeSettings(settings: WeeklyNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            weeklyNotes: settings
        });
    }
}