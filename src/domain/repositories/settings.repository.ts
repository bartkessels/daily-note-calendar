export interface SettingsRepository<T> {
    getSettings(): Promise<T>
    storeSettings(settings: T): Promise<void>
}