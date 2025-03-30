import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {Settings} from 'src/domain/settings/settings';

export interface SettingsRepositoryFactory {
    getRepository<T extends Settings>(key: SettingsType): SettingsRepository<T>;
}

export enum SettingsType {
    General = 'general',
    DailyNote = 'dailyNote',
    DisplayNotes = 'displayNotes',
    MonthlyNote = 'monthlyNote',
    QuarterlyNote = 'quarterlyNote',
    WeeklyNote = 'weeklyNote',
    YearlyNote = 'yearlyNote',
    Plugin = 'plugin'
}
