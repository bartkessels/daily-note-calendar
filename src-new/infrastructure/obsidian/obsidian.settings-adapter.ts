import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {PluginSettings} from 'src-new/domain/settings/plugin.settings';
import {Plugin} from 'obsidian';

export class ObsidianSettingsAdapter implements SettingsAdapter {
    constructor(
        private readonly plugin: Plugin
    ) {

    }

    public async getSettings(defaultSettings: PluginSettings): Promise<PluginSettings> {
        const settings = await this.plugin.loadData();
        return { ...defaultSettings, ...settings };
    }

    public async storeSettings(settings: PluginSettings): Promise<void> {
        await this.plugin.saveData(settings);
    }
}