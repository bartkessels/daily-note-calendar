import {PluginSettings} from 'src/domain/settings/plugin.settings';

export interface SettingsAdapter {
    getSettings(defaultSettings: PluginSettings): Promise<PluginSettings>
    storeSettings(settings: PluginSettings): Promise<void>;
}