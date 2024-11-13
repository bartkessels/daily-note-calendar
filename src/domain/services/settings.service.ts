import {DailyNoteSettings, Settings} from 'src/domain/models/settings';

export interface SettingsService {
    storeDailyNoteSetting(dailyNoteSettings: DailyNoteSettings): Promise<void>;
    storeWeeklySettings(weeklyNoteSettings: Settings): Promise<void>;
    storeMonthlySettings(monthlyNoteSettings: Settings): Promise<void>;

    getDailyNoteSettings(): Promise<DailyNoteSettings>;
    getWeeklyNoteSettings(): Promise<Settings>;
    getMonthlyNoteSettings(): Promise<Settings>;

    getSettings(): Promise<Settings>;
    storeSettings(settings: Settings): Promise<void>;
}