import {Plugin} from 'obsidian';
import {Settings} from 'src/domain/models/settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';

export class PluginSettingsAdapter implements SettingsAdapter {
    constructor(
        private readonly plugin: Plugin
    ) {

    }

    async getSettings(defaultSettings: Settings): Promise<Settings> {
        const settings = await this.plugin.loadData()
        return { ...defaultSettings, ...settings };
    }

    async storeSettings(settings: Settings): Promise<void> {
        await this.plugin.saveData(settings);
    }
}