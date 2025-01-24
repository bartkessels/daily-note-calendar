import {PluginSettings} from 'src-new/domain/settings/plugin.settings';

export interface SettingsAdapter {
    getSettings(defaultSettings: PluginSettings): Promise<PluginSettings>
    storeSettings(settings: PluginSettings): Promise<void>;
}