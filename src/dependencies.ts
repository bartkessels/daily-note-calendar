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

export interface Dependencies {
    readonly dateManager: DateManager;
    readonly dateParser: DateParser;
    readonly selectDayEvent: Event<Day>;

    readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
    
    readonly noteEvent: Event<Note>,
    readonly refreshNotesEvent: Event<Note[]>,
    readonly notesManager: NotesManager;
    readonly notesSettingsRepository: SettingsRepository<NotesSettings>;

    readonly dailyNoteEvent: Event<Day>;
    readonly dailyNoteSettingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>;

    readonly weeklyNoteEvent: Event<Week>;
    readonly weeklyNoteSettingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>;

    readonly monthlyNoteEvent: Event<Month>;
    readonly monthlyNoteSettingsRepository: SettingsRepository<MonthlyNotesPeriodicNoteSettings>;

    readonly quarterlyNoteEvent: Event<Month>;
    readonly quarterlyNoteSettingsRepository: SettingsRepository<QuarterlyNotesPeriodicNoteSettings>;

    readonly yearlyNoteEvent: Event<Year>;
    readonly yearlyNoteSettingsRepository: SettingsRepository<YearlyNotesPeriodicNoteSettings>;

    readonly calendarEnhancer: Enhancer<CalendarUiModel>;
    readonly notesEnhancer :Enhancer<NoteUiModel[]>;
}

export function createDependencies(plugin: Plugin): Dependencies {
    const settingsAdapter = new PluginSettingsAdapter(plugin);
    const generalSettingsRepository = new GeneralSettingsRepository(settingsAdapter);
    const dateRepository = new DateFnsDateRepository(generalSettingsRepository);
    const dateManager = new RepositoryDateManager(dateRepository);
    const dateParser = new DateFnsDateParser();
    const fileAdapter = new ObsidianFileAdapter(plugin.app.vault, plugin.app.workspace);
    const noteAdapter = new ObsidianNoteAdapter(plugin.app);
    const noticeAdapter = new ObsidianNoticeAdapter();
    const logger = new NotifyLogger(noticeAdapter);
    const fileService = new AdapterFileService(fileAdapter, logger);
    const variableBuilder = new DefaultVariableBuilder(logger);

    const selectDayEvent = new SelectDayEvent();
    const periodVariableParserStep = new PeriodVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const todayVariableParserStep = new TodayVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const titleVariableParserStep = new TitleVariableParserStep(fileAdapter, noteAdapter);

    // Daily note dependencies
    const dailyNoteSettingsRepository = new DailyNoteSettingsRepository(settingsAdapter);
    const dailyNoteEvent = new PeriodicNoteEvent<Day>();
    const dayNameBuilder = new PeriodNameBuilder<Day>(dateParser, logger);
    new PeriodicNotePipeline(dailyNoteEvent, fileService, generalSettingsRepository, dailyNoteSettingsRepository, dayNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Weekly note dependencies
    const weeklyNoteSettingsRepository = new WeeklyNoteSettingsRepository(settingsAdapter);
    const weeklyNoteEvent = new PeriodicNoteEvent<Week>();
    const weekNameBuilder = new PeriodNameBuilder<Week>(dateParser, logger);
    new PeriodicNotePipeline(weeklyNoteEvent, fileService, generalSettingsRepository, weeklyNoteSettingsRepository, weekNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Monthly note dependencies
    const monthlyNoteSettingsRepository = new MonthlyNoteSettingsRepository(settingsAdapter);
    const monthlyNoteEvent = new PeriodicNoteEvent<Month>();
    const monthNameBuilder = new PeriodNameBuilder<Month>(dateParser, logger);
    new PeriodicNotePipeline(monthlyNoteEvent, fileService, generalSettingsRepository, monthlyNoteSettingsRepository, monthNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Quarterly note dependencies
    const quarterlyNoteSettingsRepository = new QuarterlyNoteSettingsRepository(settingsAdapter);
    const quarterlyNoteEvent = new PeriodicNoteEvent<Month>();
    new PeriodicNotePipeline(quarterlyNoteEvent, fileService, generalSettingsRepository, quarterlyNoteSettingsRepository, monthNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Yearly note dependencies
    const yearlyNoteSettingsRepository = new YearlyNoteSettingsRepository(settingsAdapter);
    const yearlyNoteEvent = new PeriodicNoteEvent<Year>();
    const yearNameBuilder = new PeriodNameBuilder<Year>(dateParser, logger);
    new PeriodicNotePipeline(yearlyNoteEvent, fileService, generalSettingsRepository, yearlyNoteSettingsRepository, yearNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(periodVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    const notesSettingsRepository = new NotesSettingsRepository(settingsAdapter);
    const notesRepository = new DayNoteRepository(notesSettingsRepository, noteAdapter, dateParser, logger);
    const noteEvent = new NoteEvent();
    const refreshNotesEvent = new RefreshNotesEvent();
    const notesManager = new GenericNotesManager(
        noteEvent,
        selectDayEvent,
        dailyNoteEvent,
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

        generalSettingsRepository: generalSettingsRepository,

        noteEvent: noteEvent,
        refreshNotesEvent: refreshNotesEvent,
        notesManager: notesManager,
        notesSettingsRepository: notesSettingsRepository,

        dailyNoteEvent: dailyNoteEvent,
        dailyNoteSettingsRepository: dailyNoteSettingsRepository,

        weeklyNoteEvent: weeklyNoteEvent,
        weeklyNoteSettingsRepository: weeklyNoteSettingsRepository,

        monthlyNoteEvent: monthlyNoteEvent,
        monthlyNoteSettingsRepository: monthlyNoteSettingsRepository,

        quarterlyNoteEvent: quarterlyNoteEvent,
        quarterlyNoteSettingsRepository: quarterlyNoteSettingsRepository,

        yearlyNoteEvent: yearlyNoteEvent,
        yearlyNoteSettingsRepository: yearlyNoteSettingsRepository,

        calendarEnhancer: calendarEnhancer,
        notesEnhancer: notesEnhancer
    };
}