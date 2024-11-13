import {Settings} from 'src/domain/models/settings';

export interface SettingsAdapter {
    getSettings(defaultSettings: Settings): Promise<Settings>
    storeSettings(settings: Settings): Promise<void>;
}