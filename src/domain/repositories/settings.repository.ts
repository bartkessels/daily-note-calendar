import type { Settings } from "../models/Settings"

export interface SettingsRepository {
    getSettings(): Promise<Settings>
    storeSettings(settings: Settings): Promise<void>
}