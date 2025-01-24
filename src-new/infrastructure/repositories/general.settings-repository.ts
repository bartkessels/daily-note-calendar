import {GeneralSettings} from 'src/domain/models/settings/general.settings';
import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {DEFAULT_GENERAL_SETTINGS} from 'src-new/domain/settings/general.settings';
import {DEFAULT_PLUGIN_SETTINGS} from 'src-new/domain/settings/plugin.settings';

export class GeneralSettingsRepository implements SettingsRepository<GeneralSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: GeneralSettings): Promise<void> {
        const allSettings = { ...DEFAULT_PLUGIN_SETTINGS, generalSettings: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<GeneralSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_GENERAL_SETTINGS, ...allSettings.generalSettings };
    }
}