import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DEFAULT_SETTINGS, QuarterlyNoteSettings} from 'src/domain/models/settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';

export class QuarterlyNoteSettingsRepository implements SettingsRepository<QuarterlyNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<QuarterlyNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);
        return settings.quarterlyNotes;
    }

    public async storeSettings(settings: QuarterlyNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            quarterlyNotes: settings
        });
    }
}