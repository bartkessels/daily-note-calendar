import {Plugin} from 'obsidian';
import {AdapterFileService} from 'src/implementation/services/adapter.file-service';
import {ObsidianFileAdapter} from 'src/plugin/adapters/obsidian.file-adapter';
import {RepositoryDateManager} from 'src/implementation/managers/repository.date-manager';
import {DateFnsDateRepository} from 'src/implementation/repositories/date-fns.date.repository';
import {Day} from 'src/domain/models/day';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {DailyNoteSettingsRepository} from 'src/implementation/repositories/daily-note.settings-repository';
import {PluginSettingsAdapter} from 'src/plugin/adapters/plugin.settings-adapter';
import {WeeklyNoteSettingsRepository} from 'src/implementation/repositories/weekly-note.settings-repository';
import {MonthlyNoteSettingsRepository} from 'src/implementation/repositories/monthly-note.settings-repository';
import {Event} from 'src/domain/events/event';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {Year} from 'src/domain/models/year';
import {YearlyNoteSettingsRepository} from 'src/implementation/repositories/yearly-note.settings-repository';
import {ObsidianNoticeAdapter} from 'src/plugin/adapters/obsidian.notice-adapter';
import {NotifyLogger} from 'src/implementation/loggers/notify.logger';
import {QuarterlyNoteSettingsRepository} from 'src/implementation/repositories/quarterly-note.settings-repository';
import {ObsidianNoteAdapter} from 'src/plugin/adapters/obsidian.note-adapter';
import {DayNoteRepository} from 'src/implementation/repositories/day.note-repository';
import {DateParser} from 'src/domain/parsers/date.parser';
import {DateFnsDateParser} from 'src/implementation/parsers/date-fns.date-parser';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import {MonthlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/monthly-notes.periodic-note-settings';
import {QuarterlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/quarterly-notes.periodic-note-settings';
import {YearlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/yearly-notes.periodic-note-settings';
import { Note } from 'src/domain/models/note';
import {NotesManager} from 'src/domain/managers/notes.manager';
import {NoteEvent} from 'src/implementation/events/note.event';
import {GenericNotesManager} from 'src/implementation/managers/generic.notes-manager';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';
import {GeneralSettingsRepository} from 'src/implementation/repositories/general.settings-repository';
import {RefreshNotesEvent} from 'src/implementation/events/refresh-notes.event';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';
import {SelectDayEvent} from 'src/implementation/events/select-day.event';
import {DefaultVariableBuilder} from 'src/implementation/builders/default.variable-builder';
import {PeriodicNotePipeline} from 'src/implementation/pipelines/periodic-note.pipeline';
import {TodayVariableParserStep} from 'src/implementation/pipelines/steps/today-variable-parser.step';
import {TitleVariableParserStep} from 'src/implementation/pipelines/steps/title-variable-parser.step';
import {PeriodNameBuilder} from 'src/implementation/builders/period.name-builder';
import {PeriodVariableParserStep} from 'src/implementation/pipelines/steps/period-variable-parser.step';
import {DateManager} from 'src/domain/managers/date.manager';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import { Enhancer } from './domain/enhancers/enhancer';
import {CalendarDayEnhancerStep} from 'src/implementation/enhancers/steps/calendar-day.enhancer-step';
import {CalendarWeekEnhancerStep} from 'src/implementation/enhancers/steps/calendar-week.enhancer-step';
import {DefaultEnhancer} from 'src/implementation/enhancers/default.enhancer';
import {NotesDisplayDateEnhancerStep} from 'src/implementation/enhancers/steps/notes-display-date.enhancer-step';
import {NotesSettingsRepository} from 'src/implementation/repositories/notes.settings-repository';
import {NoteUiModel} from 'src/components/models/note.ui-model';
import {NotesSettings} from 'src/domain/models/settings/notes.settings';
import {NoteContextMenuAdapter} from 'src/plugin/adapters/note.context-menu-adapter';
import {DeleteNoteEvent} from 'src/implementation/events/delete-note.event';
import {DeleteNoteEventContext} from 'src/components/context/delete-note-event.context';
import {ManageEvent} from 'src/domain/events/manage.event';
import {PeriodicManageEvent} from 'src/implementation/events/periodic.manage-event';
import {Quarter} from 'src/domain/models/quarter';

export interface Dependencies {
    readonly dateManager: DateManager;
    readonly dateParser: DateParser;
    readonly selectDayEvent: Event<Day>;

    readonly noteContextMenuAdapter: NoteContextMenuAdapter;

    readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
    
    readonly noteEvent: Event<Note>,
    readonly refreshNotesEvent: Event<Note[]>,
    readonly deleteNoteEvent: Event<Note>;
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

    const selectDayEvent = new SelectDayEvent();
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
    const noteEvent = new NoteEvent();
    const refreshNotesEvent = new RefreshNotesEvent();
    const deleteNoteEvent = new DeleteNoteEvent();
    const notesManager = new GenericNotesManager(
        noteEvent,
        manageDayEvent,
        deleteNoteEvent,
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

    return <Dependencies>{
        dateManager: dateManager,
        dateParser: dateParser,
        selectDayEvent: selectDayEvent,

        noteContextMenuAdapter: noteContextMenuAdapter,

        generalSettingsRepository: generalSettingsRepository,

        noteEvent: noteEvent,
        refreshNotesEvent: refreshNotesEvent,
        deleteNoteEvent: deleteNoteEvent,
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
        notesEnhancer: notesEnhancer
    };
}