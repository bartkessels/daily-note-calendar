import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {SettingsAdapter} from 'src/infrastructure/adapters/settings.adapter';

export class PluginSettingsRepository implements SettingsRepository<PluginSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: PluginSettings): Promise<void> {
        await this.adapter.storeSettings(settings);
    }

    public async get(): Promise<PluginSettings> {
        return await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
    }

}