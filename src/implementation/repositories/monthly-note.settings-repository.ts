import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DEFAULT_SETTINGS, MonthlyNoteSettings} from 'src/domain/models/settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';

export class MonthlyNoteSettingsRepository implements SettingsRepository<MonthlyNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<MonthlyNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);
        return settings.monthlyNotes;
    }

    public async storeSettings(settings: MonthlyNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            monthlyNotes: settings
        });
    }
}