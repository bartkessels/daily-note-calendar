import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {SettingsAdapter} from 'src/infrastructure/adapters/settings.adapter';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/settings/general.settings';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';

export class GeneralSettingsRepository implements SettingsRepository<GeneralSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: GeneralSettings): Promise<void> {
        const storedSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        const allSettings = { ...storedSettings, generalSettings: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<GeneralSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_GENERAL_SETTINGS, ...allSettings.generalSettings };
    }
}