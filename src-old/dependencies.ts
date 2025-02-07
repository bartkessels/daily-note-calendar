import {Plugin} from 'obsidian';
import {AdapterFileService} from 'src-old/implementation/services/adapter.file-service';
import {ObsidianFileAdapter} from 'src-old/plugin/adapters/obsidian.file-adapter';
import {RepositoryDateManager} from 'src-old/implementation/managers/repository.date-manager';
import {DateFnsDateRepository} from 'src-old/implementation/repositories/date-fns.date.repository';
import {Day} from 'src-old/domain/models/day';
import {Week} from 'src-old/domain/models/week';
import {Month} from 'src-old/domain/models/month';
import {DailyNoteSettingsRepository} from 'src-old/implementation/repositories/daily-note.settings-repository';
import {PluginSettingsAdapter} from 'src-old/plugin/adapters/plugin.settings-adapter';
import {WeeklyNoteSettingsRepository} from 'src-old/implementation/repositories/weekly-note.settings-repository';
import {MonthlyNoteSettingsRepository} from 'src-old/implementation/repositories/monthly-note.settings-repository';
import {Event} from 'src-old/domain/events/event';
import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {Year} from 'src-old/domain/models/year';
import {YearlyNoteSettingsRepository} from 'src-old/implementation/repositories/yearly-note.settings-repository';
import {ObsidianNoticeAdapter} from 'src-old/plugin/adapters/obsidian.notice-adapter';
import {NotifyLogger} from 'src-old/implementation/loggers/notify.logger';
import {QuarterlyNoteSettingsRepository} from 'src-old/implementation/repositories/quarterly-note.settings-repository';
import {ObsidianNoteAdapter} from 'src-old/plugin/adapters/obsidian.note-adapter';
import {DayNoteRepository} from 'src-old/implementation/repositories/day.note-repository';
import {DateParser} from 'src-old/domain/parsers/date.parser';
import {DateFnsDateParser} from 'src-old/implementation/parsers/date-fns.date-parser';
import {DailyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/daily-notes.periodic-note-settings';
import {WeeklyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/weekly-notes.periodic-note-settings';
import {MonthlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/monthly-notes.periodic-note-settings';
import {QuarterlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/quarterly-notes.periodic-note-settings';
import {YearlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/yearly-notes.periodic-note-settings';
import { Note } from 'src-old/domain/models/note';
import {NotesManager} from 'src-old/domain/managers/notes.manager';
import {GenericNotesManager} from 'src-old/implementation/managers/generic.notes-manager';
import {GeneralSettings} from 'src-old/domain/models/settings/general.settings';
import {GeneralSettingsRepository} from 'src-old/implementation/repositories/general.settings-repository';
import {RefreshNotesEvent} from 'src-old/implementation/events/refresh-notes.event';
import {DefaultVariableBuilder} from 'src-old/implementation/builders/default.variable-builder';
import {PeriodicNotePipeline} from 'src-old/implementation/pipelines/periodic-note.pipeline';
import {TodayVariableParserStep} from 'src-old/implementation/pipelines/steps/today-variable-parser.step';
import {TitleVariableParserStep} from 'src-old/implementation/pipelines/steps/title-variable-parser.step';
import {PeriodNameBuilder} from 'src-old/implementation/builders/period.name-builder';
import {PeriodVariableParserStep} from 'src-old/implementation/pipelines/steps/period-variable-parser.step';
import {DateManager} from 'src-old/domain/managers/date.manager';
import {CalendarUiModel} from 'src-old/components/models/calendar.ui-model';
import { Enhancer } from './domain/enhancers/enhancer';
import {CalendarDayEnhancerStep} from 'src-old/implementation/enhancers/steps/calendar-day.enhancer-step';
import {CalendarWeekEnhancerStep} from 'src-old/implementation/enhancers/steps/calendar-week.enhancer-step';
import {DefaultEnhancer} from 'src-old/implementation/enhancers/default.enhancer';
import {NotesDisplayDateEnhancerStep} from 'src-old/implementation/enhancers/steps/notes-display-date.enhancer-step';
import {NotesSettingsRepository} from 'src-old/implementation/repositories/notes.settings-repository';
import {NoteUiModel} from 'src-old/components/models/note.ui-model';
import {NotesSettings} from 'src-old/domain/models/settings/notes.settings';
import {NoteContextMenuAdapter} from 'src-old/plugin/adapters/note.context-menu-adapter';
import {ManageEvent} from 'src-old/domain/events/manage.event';
import {PeriodicManageEvent} from 'src-old/implementation/events/periodic.manage-event';
import {Quarter} from 'src-old/domain/models/quarter';
import {NoteManageEvent} from 'src-old/implementation/events/note.manage-event';
import {CommandHandler} from 'src-old/domain/command-handlers/command-handler';
import {DisplayInCalendarCommandHandler} from 'src-old/implementation/command-handlers/display-in-calendar.command-handler';

export interface Dependencies {
    readonly dateManager: DateManager;
    readonly dateParser: DateParser;

    readonly noteContextMenuAdapter: NoteContextMenuAdapter;

    readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
    
    readonly manageNoteEvent: ManageEvent<Note>,
    readonly refreshNotesEvent: Event<Note[]>,
    readonly notesManager: NotesManager;
    readonly notesSettingsRepository: SettingsRepository<NotesSettings>;

    readonly manageDayEvent: ManageEvent<Day>;
    readonly dailyNoteSettingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>;

    readonly manageWeekEvent: ManageEvent<Week>;
    readonly weeklyNoteSettingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>;

    readonly manageMonthEvent: ManageEvent<Month>;
    readonly monthlyNoteSettingsRepository: SettingsRepository<MonthlyNotesPeriodicNoteSettings>;

    readonly manageQuarterEvent: ManageEvent<Quarter>;
    readonly quarterlyNoteSettingsRepository: SettingsRepository<QuarterlyNotesPeriodicNoteSettings>;

    readonly manageYearEvent: ManageEvent<Year>;
    readonly yearlyNoteSettingsRepository: SettingsRepository<YearlyNotesPeriodicNoteSettings>;

    readonly calendarEnhancer: Enhancer<CalendarUiModel>;
    readonly notesEnhancer :Enhancer<NoteUiModel[]>;

    readonly displayInCalendarCommandHandler: CommandHandler;
}

export function createDependencies(plugin: Plugin): Dependencies {
    // Adapters
    const settingsAdapter = new PluginSettingsAdapter(plugin);
    const fileAdapter = new ObsidianFileAdapter(plugin.app, plugin.app.workspace);
    const noteAdapter = new ObsidianNoteAdapter(plugin.app);
    const noticeAdapter = new ObsidianNoticeAdapter();
    const logger = new NotifyLogger(noticeAdapter);
    const fileService = new AdapterFileService(fileAdapter, logger);
    const noteContextMenuAdapter = new NoteContextMenuAdapter();

    const generalSettingsRepository = new GeneralSettingsRepository(settingsAdapter);
    const dateRepository = new DateFnsDateRepository(generalSettingsRepository);
    const dateManager = new RepositoryDateManager(dateRepository);
    const dateParser = new DateFnsDateParser();
    const variableBuilder = new DefaultVariableBuilder(logger);

    const periodVariableParserStep = new PeriodVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const todayVariableParserStep = new TodayVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const titleVariableParserStep = new TitleVariableParserStep(fileAdapter, noteAdapter);

    // Daily note dependencies
    const manageDayEvent = new PeriodicManageEvent<Day>();
    const dailyNoteSettingsRepository = new DailyNoteSettingsRepository(settingsAdapter);
    const dayNameBuilder = new PeriodNameBuilder<Day>(dateParser, logger);
    new PeriodicNotePipeline(manageDayEvent, fileService, generalSettingsRepository, dailyNoteSettingsRepository, dayNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Weekly note dependencies
    const manageWeekEvent = new PeriodicManageEvent<Week>();
    const weeklyNoteSettingsRepository = new WeeklyNoteSettingsRepository(settingsAdapter);
    const weekNameBuilder = new PeriodNameBuilder<Week>(dateParser, logger);
    new PeriodicNotePipeline(manageWeekEvent, fileService, generalSettingsRepository, weeklyNoteSettingsRepository, weekNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Monthly note dependencies
    const manageMonthEvent = new PeriodicManageEvent<Month>();
    const monthlyNoteSettingsRepository = new MonthlyNoteSettingsRepository(settingsAdapter);
    const monthNameBuilder = new PeriodNameBuilder<Month>(dateParser, logger);
    new PeriodicNotePipeline(manageMonthEvent, fileService, generalSettingsRepository, monthlyNoteSettingsRepository, monthNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Quarterly note dependencies
    const manageQuarterEvent = new PeriodicManageEvent<Quarter>();
    const quarterlyNoteSettingsRepository = new QuarterlyNoteSettingsRepository(settingsAdapter);
    const quarterNameBuilder = new PeriodNameBuilder<Quarter>(dateParser, logger);
    new PeriodicNotePipeline(manageQuarterEvent, fileService, generalSettingsRepository, quarterlyNoteSettingsRepository, quarterNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Yearly note dependencies
    const manageYearEvent = new PeriodicManageEvent<Year>();
    const yearlyNoteSettingsRepository = new YearlyNoteSettingsRepository(settingsAdapter);
    const yearNameBuilder = new PeriodNameBuilder<Year>(dateParser, logger);
    new PeriodicNotePipeline(manageYearEvent, fileService, generalSettingsRepository, yearlyNoteSettingsRepository, yearNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Notes
    const notesSettingsRepository = new NotesSettingsRepository(settingsAdapter);
    const notesRepository = new DayNoteRepository(notesSettingsRepository, noteAdapter, dateParser, logger);
    const manageNoteEvent = new NoteManageEvent();
    const refreshNotesEvent = new RefreshNotesEvent();
    const notesManager = new GenericNotesManager(
        manageNoteEvent,
        manageDayEvent,
        refreshNotesEvent,
        fileService,
        notesRepository,
        generalSettingsRepository
    );

    const dayEnhancerStep = new CalendarDayEnhancerStep(generalSettingsRepository, dailyNoteSettingsRepository, dayNameBuilder, fileAdapter);
    const weekEnhancerStep = new CalendarWeekEnhancerStep(generalSettingsRepository, weeklyNoteSettingsRepository, weekNameBuilder, fileAdapter);
    const calendarEnhancer = new DefaultEnhancer<CalendarUiModel>()
        .withStep(dayEnhancerStep)
        .withStep(weekEnhancerStep);

    const notesDisplayDateEnhancerStep = new NotesDisplayDateEnhancerStep(notesSettingsRepository, dateParser);
    const notesEnhancer = new DefaultEnhancer<NoteUiModel[]>()
        .withStep(notesDisplayDateEnhancerStep);

    const displayInCalendarCommandHandler = new DisplayInCalendarCommandHandler(
        notesSettingsRepository, noteAdapter, dateRepository, manageDayEvent, dateParser
    );

    return <Dependencies>{
        dateManager: dateManager,
        dateParser: dateParser,

        noteContextMenuAdapter: noteContextMenuAdapter,

        generalSettingsRepository: generalSettingsRepository,

        manageNoteEvent: manageNoteEvent,
        refreshNotesEvent: refreshNotesEvent,
        notesManager: notesManager,
        notesSettingsRepository: notesSettingsRepository,

        manageDayEvent: manageDayEvent,
        dailyNoteSettingsRepository: dailyNoteSettingsRepository,

        manageWeekEvent: manageWeekEvent,
        weeklyNoteSettingsRepository: weeklyNoteSettingsRepository,

        manageMonthEvent: manageMonthEvent,
        monthlyNoteSettingsRepository: monthlyNoteSettingsRepository,

        manageQuarterEvent: manageQuarterEvent,
        quarterlyNoteSettingsRepository: quarterlyNoteSettingsRepository,

        manageYearEvent: manageYearEvent,
        yearlyNoteSettingsRepository: yearlyNoteSettingsRepository,

        calendarEnhancer: calendarEnhancer,
        notesEnhancer: notesEnhancer,

        displayInCalendarCommandHandler: displayInCalendarCommandHandler
    };
}