import {Settings} from 'src/domain/models/settings/settings';

export interface SettingsRepository<T extends Settings> {
    getSettings(): Promise<T>
    storeSettings(settings: T): Promise<void>
}