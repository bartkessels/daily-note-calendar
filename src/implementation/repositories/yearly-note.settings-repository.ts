import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DEFAULT_SETTINGS, YearlyNoteSettings} from 'src/domain/models/settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';

export class YearlyNoteSettingsRepository implements SettingsRepository<YearlyNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<YearlyNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);
        return settings.yearlyNotes;
    }

    public async storeSettings(settings: YearlyNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            yearlyNotes: settings
        });
    }
}