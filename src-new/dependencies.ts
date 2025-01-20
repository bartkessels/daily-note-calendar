import {ObsidianSettingsAdapter} from 'src-new/infrastructure/obsidian/obsidian.settings-adapter';
import {Plugin} from 'obsidian';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings-adapter';
import {SettingsRepositoryFactory, SettingsType} from 'src-new/infrastructure/contracts/settings-repository-factory';
import {GeneralSettingsRepository} from 'src-new/infrastructure/repositories/general.settings-repository';
import {DefaultSettingsRepositoryFactory} from 'src-new/infrastructure/factories/default-settings-repository.factory';
import {DisplayNotesSettingsRepository} from 'src-new/infrastructure/repositories/display-notes.settings-repository';
import {DailyNoteSettingsRepository} from 'src-new/infrastructure/repositories/daily-note.settings.repository';
import {MonthlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/monthly-note.settings-repository';
import {QuarterlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/quarterly-note.settings-repository';
import {WeeklyNoteSettingsRepository} from 'src-new/infrastructure/repositories/weekly-note.settings-repository';
import {YearlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/yearly-note.settings-repository';
import {DailyNoteSettings} from 'src-new/domain/settings/daily-note.settings';
import {DisplayNotesSettings} from 'src-new/domain/settings/display-notes.settings';
import {GeneralSettings} from 'src-new/domain/settings/general.settings';
import {MonthlyNoteSettings} from 'src-new/domain/settings/monthly-note.settings';
import {QuarterlyNoteSettings} from 'src-new/domain/settings/quarterly-note.settings';
import {WeeklyNoteSettings} from 'src-new/domain/settings/weekly-note.settings';
import {YearlyNoteSettings} from 'src-new/domain/settings/yearly-note.settings';

export function hoi(plugin: Plugin) {
    // Adapters
    const settingsAdapter = new ObsidianSettingsAdapter(plugin);

    // Infrastructure
    const settingsRepositoryFactory = buildSettingsRepositoryFactory(settingsAdapter);
}

function buildSettingsRepositoryFactory(adapter: SettingsAdapter): SettingsRepositoryFactory {
    const dailyNoteSettingsRepository = new DailyNoteSettingsRepository(adapter);
    const displayNotesSettingsRepository = new DisplayNotesSettingsRepository(adapter);
    const generalSettingsRepository = new GeneralSettingsRepository(adapter);
    const monthlyNoteSettingsRepository = new MonthlyNoteSettingsRepository(adapter);
    const quarterlyNoteSettingsRepository = new QuarterlyNoteSettingsRepository(adapter);
    const weeklyNoteSettingsRepository = new WeeklyNoteSettingsRepository(adapter);
    const yearlyNoteSettingsRepository = new YearlyNoteSettingsRepository(adapter);

    return new DefaultSettingsRepositoryFactory()
        .register<DailyNoteSettings>(SettingsType.DailyNote, dailyNoteSettingsRepository)
        .register<DisplayNotesSettings>(SettingsType.DisplayNotes, displayNotesSettingsRepository)
        .register<GeneralSettings>(SettingsType.General, generalSettingsRepository)
        .register<MonthlyNoteSettings>(SettingsType.MonthlyNote, monthlyNoteSettingsRepository)
        .register<QuarterlyNoteSettings>(SettingsType.QuarterlyNote, quarterlyNoteSettingsRepository)
        .register<WeeklyNoteSettings>(SettingsType.WeeklyNote, weeklyNoteSettingsRepository)
        .register<YearlyNoteSettings>(SettingsType.YearlyNote, yearlyNoteSettingsRepository);
}