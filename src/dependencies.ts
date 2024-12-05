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
import {DayVariableParserStep} from 'src/implementation/pipelines/steps/periodic-parser-steps/day-variable-parser.step';
import {
    WeekVariableParserStep
} from 'src/implementation/pipelines/steps/periodic-parser-steps/week-variable-parser.step';
import {
    MonthVariableParserStep
} from 'src/implementation/pipelines/steps/periodic-parser-steps/month-variable-parser.step';
import {
    YearVariableParserStep
} from 'src/implementation/pipelines/steps/periodic-parser-steps/year-variable-parser.step';
import {TodayVariableParserStep} from 'src/implementation/pipelines/steps/today-variable-parser.step';
import {TitleVariableParserStep} from 'src/implementation/pipelines/steps/title-variable-parser.step';
import {PeriodNameBuilder} from 'src/implementation/builders/period.name-builder';

export interface Dependencies {
    readonly dateManager: RepositoryDateManager;
    readonly dateParser: DateParser;
    readonly selectDayEvent: Event<Day>;

    readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
    
    readonly noteEvent: Event<Note>,
    readonly refreshNotesEvent: Event<Note[]>,
    readonly notesManager: NotesManager;

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
}

export function createDependencies(plugin: Plugin): Dependencies {
    const dateRepository = new DateFnsDateRepository();
    const dateManager = new RepositoryDateManager(dateRepository);
    const dateParser = new DateFnsDateParser();
    const fileAdapter = new ObsidianFileAdapter(plugin.app.vault, plugin.app.workspace);
    const settingsAdapter = new PluginSettingsAdapter(plugin);
    const noteAdapter = new ObsidianNoteAdapter(plugin.app);
    const noticeAdapter = new ObsidianNoticeAdapter();
    const logger = new NotifyLogger(noticeAdapter);
    const fileService = new AdapterFileService(fileAdapter, logger);
    const variableBuilder = new DefaultVariableBuilder(logger);

    const selectDayEvent = new SelectDayEvent();
    const generalSettingsRepository = new GeneralSettingsRepository(settingsAdapter);
    const todayVariableParserStep = new TodayVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const titleVariableParserStep = new TitleVariableParserStep(fileAdapter, noteAdapter);

    // Daily note dependencies
    const dailyNoteSettingsRepository = new DailyNoteSettingsRepository(settingsAdapter);
    const dayVariableParser = new DayVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const dailyNoteEvent = new PeriodicNoteEvent<Day>();
    const dayNameBuilder = new PeriodNameBuilder<Day>(dateParser, logger);
    new PeriodicNotePipeline(dailyNoteEvent, fileService, dayVariableParser, dailyNoteSettingsRepository, dayNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Weekly note dependencies
    const weeklyNoteSettingsRepository = new WeeklyNoteSettingsRepository(settingsAdapter);
    const weekVariableParser = new WeekVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const weeklyNoteEvent = new PeriodicNoteEvent<Week>();
    const weekNameBuilder = new PeriodNameBuilder<Week>(dateParser, logger);
    new PeriodicNotePipeline(weeklyNoteEvent, fileService, weekVariableParser, weeklyNoteSettingsRepository, weekNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Monthly note dependencies
    const monthlyNoteSettingsRepository = new MonthlyNoteSettingsRepository(settingsAdapter);
    const monthVariableParser = new MonthVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const monthlyNoteEvent = new PeriodicNoteEvent<Month>();
    const monthNameBuilder = new PeriodNameBuilder<Month>(dateParser, logger);
    new PeriodicNotePipeline(monthlyNoteEvent, fileService, monthVariableParser, monthlyNoteSettingsRepository, monthNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Quarterly note dependencies
    const quarterlyNoteSettingsRepository = new QuarterlyNoteSettingsRepository(settingsAdapter);
    const quarterlyNoteEvent = new PeriodicNoteEvent<Month>();
    new PeriodicNotePipeline(quarterlyNoteEvent, fileService, monthVariableParser, quarterlyNoteSettingsRepository, monthNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    // Yearly note dependencies
    const yearlyNoteSettingsRepository = new YearlyNoteSettingsRepository(settingsAdapter);
    const yearVariableParser = new YearVariableParserStep(fileAdapter, variableBuilder, dateParser);
    const yearlyNoteEvent = new PeriodicNoteEvent<Year>();
    const yearNameBuilder = new PeriodNameBuilder<Year>(dateParser, logger);
    new PeriodicNotePipeline(dailyNoteEvent, fileService, dayVariableParser, dailyNoteSettingsRepository, dayNameBuilder)
    new PeriodicNotePipeline(yearlyNoteEvent, fileService, yearVariableParser, yearlyNoteSettingsRepository, yearNameBuilder)
        .registerPreCreateStep(titleVariableParserStep)
        .registerPostCreateStep(titleVariableParserStep)
        .registerPostCreateStep(todayVariableParserStep);

    const notesRepository = new DayNoteRepository(noteAdapter);
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

    return {
        dateManager,
        dateParser,

        selectDayEvent,
        generalSettingsRepository,

        noteEvent,
        refreshNotesEvent,
        notesManager,

        dailyNoteEvent,
        dailyNoteSettingsRepository,

        weeklyNoteEvent,
        weeklyNoteSettingsRepository,

        monthlyNoteEvent,
        monthlyNoteSettingsRepository,

        quarterlyNoteEvent,
        quarterlyNoteSettingsRepository,

        yearlyNoteEvent,
        yearlyNoteSettingsRepository,
    };
}