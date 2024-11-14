import {Plugin} from 'obsidian';
import {AdapterFileService} from 'src/implementation/services/adapter.file-service';
import {ObsidianFileAdapter} from 'src/plugin/adapters/obsidian.file-adapter';
import {RepositoryDateManager} from 'src/implementation/managers/repository.date-manager';
import {DefaultDateRepository} from 'src/implementation/repositories/default.date.repository';
import {NoteManager} from 'src/domain/managers/note.manager';
import {Day} from 'src/domain/models/day';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {DailyNoteEvent} from 'src/implementation/events/daily-note.event';
import {DayNameBuilder} from 'src/implementation/builders/day.name-builder';
import {DailyNoteManager} from 'src/implementation/managers/daily.note-manager';
import {WeeklyNoteEvent} from 'src/implementation/events/weekly-note.event';
import {WeekNameBuilder} from 'src/implementation/builders/week.name-builder';
import {WeeklyNoteManager} from 'src/implementation/managers/weekly.note-manager';
import {MonthlyNoteEvent} from 'src/implementation/events/monthly-note.event';
import {MonthNameBuilder} from 'src/implementation/builders/month.name-builder';
import {MonthlyNoteManager} from 'src/implementation/managers/monthly.note-manager';
import {DailyNoteSettingsRepository} from 'src/implementation/repositories/daily-note.settings-repository';
import {PluginSettingsAdapter} from 'src/plugin/adapters/plugin.settings-adapter';
import {WeeklyNoteSettingsRepository} from 'src/implementation/repositories/weekly-note.settings-repository';
import {MonthlyNoteSettingsRepository} from 'src/implementation/repositories/monthly-note.settings-repository';
import {Event} from 'src/domain/events/event';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {
    DailyNoteSettings,
    MonthlyNoteSettings,
    WeeklyNoteSettings,
    YearlyNoteSettings
} from 'src/domain/models/settings';
import {Year} from 'src/domain/models/year';
import {YearlyNoteSettingsRepository} from 'src/implementation/repositories/yearly-note.settings-repository';
import {YearlyNoteEvent} from 'src/implementation/events/yearly-note.event';
import {YearNameBuilder} from 'src/implementation/builders/year.name-builder';
import {YearlyNoteManager} from 'src/implementation/managers/yearly.note-manager';
import {ObsidianNoticeAdapter} from 'src/plugin/adapters/obsidian.notice-adapter';
import {NotifyLogger} from 'src/implementation/loggers/notify.logger';

export interface Dependencies {
    readonly dateManager: RepositoryDateManager;

    readonly dailyNoteEvent: Event<Day>;
    readonly dailyNoteSettingsRepository: SettingsRepository<DailyNoteSettings>;
    readonly dailyNoteManager: NoteManager<Day>;

    readonly weeklyNoteEvent: Event<Week>;
    readonly weeklyNoteSettingsRepository: SettingsRepository<WeeklyNoteSettings>;
    readonly weeklyNoteManager: NoteManager<Week>;

    readonly monthlyNoteEvent: Event<Month>;
    readonly monthlyNoteSettingsRepository: SettingsRepository<MonthlyNoteSettings>;
    readonly monthlyNoteManager: NoteManager<Month>;

    readonly yearlyNoteEvent: Event<Year>;
    readonly yearlyNoteSettingsRepository: SettingsRepository<YearlyNoteSettings>;
    readonly yearlyNoteManager: NoteManager<Year>;
}

export function createDependencies(plugin: Plugin): Dependencies {
    const dateRepository = new DefaultDateRepository();
    const dateManager = new RepositoryDateManager(dateRepository);
    const fileAdapter = new ObsidianFileAdapter(plugin.app.vault, plugin.app.workspace);
    const settingsAdapter = new PluginSettingsAdapter(plugin);
    const noticeAdapter = new ObsidianNoticeAdapter();
    const logger = new NotifyLogger(noticeAdapter);
    const fileService = new AdapterFileService(fileAdapter, logger);

    const dailyNoteSettingsRepository = new DailyNoteSettingsRepository(settingsAdapter);
    const dailyNoteEvent = new DailyNoteEvent();
    const dayNameBuilder = new DayNameBuilder(logger);
    const dailyNoteManager = new DailyNoteManager(dailyNoteEvent, dailyNoteSettingsRepository, dayNameBuilder, fileService);

    const weeklyNoteSettingsRepository = new WeeklyNoteSettingsRepository(settingsAdapter);
    const weeklyNoteEvent = new WeeklyNoteEvent();
    const weekNameBuilder = new WeekNameBuilder(logger);
    const weeklyNoteManager = new WeeklyNoteManager(weeklyNoteEvent, weeklyNoteSettingsRepository, weekNameBuilder, fileService);

    const monthlyNoteSettingsRepository = new MonthlyNoteSettingsRepository(settingsAdapter);
    const monthlyNoteEvent = new MonthlyNoteEvent();
    const monthNameBuilder = new MonthNameBuilder(logger);
    const monthlyNoteManager = new MonthlyNoteManager(monthlyNoteEvent, monthlyNoteSettingsRepository, monthNameBuilder, fileService);

    const yearlyNoteSettingsRepository = new YearlyNoteSettingsRepository(settingsAdapter);
    const yearlyNoteEvent = new YearlyNoteEvent();
    const yearNameBuilder = new YearNameBuilder(logger);
    const yearlyNoteManager = new YearlyNoteManager(yearlyNoteEvent, yearlyNoteSettingsRepository, yearNameBuilder, fileService);

    return {
        dateManager,

        dailyNoteEvent,
        dailyNoteSettingsRepository,
        dailyNoteManager,

        weeklyNoteEvent,
        weeklyNoteSettingsRepository,
        weeklyNoteManager,

        monthlyNoteEvent,
        monthlyNoteSettingsRepository,
        monthlyNoteManager,

        yearlyNoteEvent,
        yearlyNoteSettingsRepository,
        yearlyNoteManager
    };
}