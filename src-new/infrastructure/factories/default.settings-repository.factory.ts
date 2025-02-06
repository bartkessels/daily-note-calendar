import {SettingsRepositoryFactory, SettingsType} from 'src-new/infrastructure/contracts/settings-repository-factory';
import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {Settings} from 'src-new/domain/settings/settings';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {DailyNoteSettingsRepository} from 'src-new/infrastructure/repositories/daily-note.settings.repository';
import {PluginSettingsRepository} from 'src-new/infrastructure/repositories/plugin.settings-repository';
import {GeneralSettingsRepository} from 'src-new/infrastructure/repositories/general.settings-repository';
import {WeeklyNoteSettingsRepository} from 'src-new/infrastructure/repositories/weekly-note.settings-repository';
import {MonthlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/monthly-note.settings-repository';
import {QuarterlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/quarterly-note.settings-repository';
import {YearlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/yearly-note.settings-repository';

export class DefaultSettingsRepositoryFactory implements SettingsRepositoryFactory {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public getRepository<T extends Settings>(key: SettingsType): SettingsRepository<T> {
        switch (key) {
            case SettingsType.Plugin:
                return new PluginSettingsRepository(this.adapter) as unknown as SettingsRepository<T>;
            case SettingsType.General:
                return new GeneralSettingsRepository(this.adapter) as unknown as SettingsRepository<T>;
            case SettingsType.DailyNote:
                return new DailyNoteSettingsRepository(this.adapter) as unknown as SettingsRepository<T>;
            case SettingsType.WeeklyNote:
                return new WeeklyNoteSettingsRepository(this.adapter) as unknown as SettingsRepository<T>;
            case SettingsType.MonthlyNote:
                return new MonthlyNoteSettingsRepository(this.adapter) as unknown as SettingsRepository<T>;
            case SettingsType.QuarterlyNote:
                return new QuarterlyNoteSettingsRepository(this.adapter) as unknown as SettingsRepository<T>;
            case SettingsType.YearlyNote:
                return new YearlyNoteSettingsRepository(this.adapter) as unknown as SettingsRepository<T>;
        }

        throw new Error(`Unknown settings type: ${key}.`);
    }
}