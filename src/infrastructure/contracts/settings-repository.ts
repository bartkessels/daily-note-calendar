export interface SettingsRepository<T> {
    store(settings: T): Promise<void>;
    get(): Promise<T>;
}