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
import {Year} from 'src/domain/models/year';
import {YearlyNoteSettingsRepository} from 'src/implementation/repositories/yearly-note.settings-repository';
import {YearlyNoteEvent} from 'src/implementation/events/yearly-note.event';
import {YearNameBuilder} from 'src/implementation/builders/year.name-builder';
import {YearlyNoteManager} from 'src/implementation/managers/yearly.note-manager';
import {ObsidianNoticeAdapter} from 'src/plugin/adapters/obsidian.notice-adapter';
import {NotifyLogger} from 'src/implementation/loggers/notify.logger';
import {QuarterlyNoteEvent} from 'src/implementation/events/quarterly-note.event';
import {QuarterlyNoteSettingsRepository} from 'src/implementation/repositories/quarterly-note.settings-repository';
import {QuarterlyNoteManager} from 'src/implementation/managers/quarterly.note-manager';
import {NoteRepository} from 'src/domain/repositories/note.repository';
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

export interface Dependencies {
    readonly dateManager: RepositoryDateManager;
    readonly dateParser: DateParser;

    readonly noteEvent: Event<Note>,
    readonly notesManager: NotesManager;

    readonly dailyNoteEvent: Event<Day>;
    readonly dailyNoteSettingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>;
    readonly dailyNoteManager: NoteManager<Day>;

    readonly weeklyNoteEvent: Event<Week>;
    readonly weeklyNoteSettingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>;
    readonly weeklyNoteManager: NoteManager<Week>;

    readonly monthlyNoteEvent: Event<Month>;
    readonly monthlyNoteSettingsRepository: SettingsRepository<MonthlyNotesPeriodicNoteSettings>;
    readonly monthlyNoteManager: NoteManager<Month>;

    readonly quarterlyNoteEvent: Event<Month>;
    readonly quarterlyNoteSettingsRepository: SettingsRepository<QuarterlyNotesPeriodicNoteSettings>;
    readonly quarterlyNoteManager: NoteManager<Month>;

    readonly yearlyNoteEvent: Event<Year>;
    readonly yearlyNoteSettingsRepository: SettingsRepository<YearlyNotesPeriodicNoteSettings>;
    readonly yearlyNoteManager: NoteManager<Year>;
}

export function createDependencies(plugin: Plugin): Dependencies {
    const dateRepository = new DefaultDateRepository();
    const dateManager = new RepositoryDateManager(dateRepository);
    const dateParser = new DateFnsDateParser();
    const fileAdapter = new ObsidianFileAdapter(plugin.app.vault, plugin.app.workspace);
    const settingsAdapter = new PluginSettingsAdapter(plugin);
    const noteAdapter = new ObsidianNoteAdapter(plugin.app);
    const noticeAdapter = new ObsidianNoticeAdapter();
    const logger = new NotifyLogger(noticeAdapter);
    const fileService = new AdapterFileService(fileAdapter, logger);

    const notesRepository = new DayNoteRepository(noteAdapter);
    const noteEvent = new NoteEvent();
    const notesManager = new GenericNotesManager(noteEvent, fileService, notesRepository);

    const dailyNoteSettingsRepository = new DailyNoteSettingsRepository(settingsAdapter);
    const dailyNoteEvent = new DailyNoteEvent();
    const dayNameBuilder = new DayNameBuilder(dateParser, logger);
    const dailyNoteManager = new DailyNoteManager(dailyNoteEvent, dailyNoteSettingsRepository, dayNameBuilder, fileService);

    const weeklyNoteSettingsRepository = new WeeklyNoteSettingsRepository(settingsAdapter);
    const weeklyNoteEvent = new WeeklyNoteEvent();
    const weekNameBuilder = new WeekNameBuilder(dateParser, logger);
    const weeklyNoteManager = new WeeklyNoteManager(weeklyNoteEvent, weeklyNoteSettingsRepository, weekNameBuilder, fileService);

    const monthlyNoteSettingsRepository = new MonthlyNoteSettingsRepository(settingsAdapter);
    const monthlyNoteEvent = new MonthlyNoteEvent();
    const monthNameBuilder = new MonthNameBuilder(dateParser, logger);
    const monthlyNoteManager = new MonthlyNoteManager(monthlyNoteEvent, monthlyNoteSettingsRepository, monthNameBuilder, fileService);

    const quarterlyNoteSettingsRepository = new QuarterlyNoteSettingsRepository(settingsAdapter);
    const quarterlyNoteEvent = new QuarterlyNoteEvent();
    const quarterlyNoteManager = new QuarterlyNoteManager(quarterlyNoteEvent, quarterlyNoteSettingsRepository, monthNameBuilder, fileService);

    const yearlyNoteSettingsRepository = new YearlyNoteSettingsRepository(settingsAdapter);
    const yearlyNoteEvent = new YearlyNoteEvent();
    const yearNameBuilder = new YearNameBuilder(dateParser, logger);
    const yearlyNoteManager = new YearlyNoteManager(yearlyNoteEvent, yearlyNoteSettingsRepository, yearNameBuilder, fileService);

    return {
        dateManager,
        dateParser,

        noteEvent,
        notesManager,

        dailyNoteEvent,
        dailyNoteSettingsRepository,
        dailyNoteManager,

        weeklyNoteEvent,
        weeklyNoteSettingsRepository,
        weeklyNoteManager,

        monthlyNoteEvent,
        monthlyNoteSettingsRepository,
        monthlyNoteManager,

        quarterlyNoteEvent,
        quarterlyNoteSettingsRepository,
        quarterlyNoteManager,

        yearlyNoteEvent,
        yearlyNoteSettingsRepository,
        yearlyNoteManager
    };
}