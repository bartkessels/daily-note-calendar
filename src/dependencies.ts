import {ObsidianSettingsAdapter} from 'src/infrastructure/obsidian/obsidian.settings-adapter';
import {Plugin} from 'obsidian';
import {DefaultSettingsRepositoryFactory} from 'src/infrastructure/factories/default.settings-repository-factory';
import {DefaultNameBuilderFactory} from 'src/business/factories/default.name-builder-factory';
import {DefaultVariableParserFactory} from 'src/business/factories/default.variable-parser-factory';
import {DefaultDateParserFactory} from 'src/infrastructure/factories/default.date-parser-factory';
import {ObsidianFileAdapter} from 'src/infrastructure/obsidian/obsidian.file-adapter';
import {DefaultVariableFactory} from 'src/business/factories/default.variable-factory';
import {ObsidianNoteAdapter} from 'src/infrastructure/obsidian/obsidian.note-adapter';
import {DefaultCalendarViewModel} from 'src/presentation/view-models/default.calendar-view-model';
import {DefaultCalendarService} from 'src/presentation/services/default.calendar-service';
import {DefaultPeriodicNoteManager} from 'src/business/managers/default.periodic-note-manager';
import {DefaultDateRepositoryFactory} from 'src/infrastructure/factories/default.date-repository-factory';
import {DefaultFileRepositoryFactory} from 'src/infrastructure/factories/default.file-repository-factory';
import {SettingsRepositoryFactory} from 'src/infrastructure/contracts/settings-repository-factory';
import {DefaultNoteRepositoryFactory} from 'src/infrastructure/factories/default.note-repository-factory';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {DefaultDateManagerFactory} from 'src/business/factories/default.date-manager-factory';
import {DefaultCommandHandlerFactory} from 'src/presentation/factories/default.command-handler-factory';
import {DefaultNoteManagerFactory} from 'src/business/factories/default.note-manager-factory';
import {CommandHandlerFactory} from 'src/presentation/contracts/command-handler-factory';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {DefaultNotesViewModel} from 'src/presentation/view-models/default.notes-view-model';
import {ContextMenuAdapter} from 'src/presentation/adapters/context-menu.adapter';
import {ObsidianContextMenuAdapter} from 'src/presentation/obsidian/obsidian.context-menu-adapter';
import {DefaultPeriodService} from 'src/presentation/services/default.period-service';
import {DayPeriodNoteViewModel} from 'src/presentation/view-models/day.period-note-view-model';
import {WeekPeriodNoteViewModel} from 'src/presentation/view-models/week.period-note-view-model';
import {MonthPeriodNoteViewModel} from 'src/presentation/view-models/month.period-note-view-model';
import {QuarterPeriodNoteViewModel} from 'src/presentation/view-models/quarter.period-note-view-model';
import {YearPeriodNoteViewModel} from 'src/presentation/view-models/year.period-note-view-model';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';
import {NotesViewModel} from 'src/presentation/contracts/notes.view-model';

export interface Dependencies {
    calendarViewModel: CalendarViewModel;
    dailyNoteViewModel: DayPeriodNoteViewModel;
    weeklyNoteViewModel: WeekPeriodNoteViewModel;
    monthlyNoteViewModel: MonthPeriodNoteViewModel;
    quarterlyNoteViewModel: QuarterPeriodNoteViewModel;
    yearlyNoteViewModel: YearPeriodNoteViewModel;
    notesViewModel: NotesViewModel;
    dateManagerFactory: DateManagerFactory;
    dateParserFactory: DateParserFactory;
    settingsRepositoryFactory: SettingsRepositoryFactory;
    commandHandlerFactory: CommandHandlerFactory;
    contextMenuAdapter: ContextMenuAdapter;
}

export function getDependencies(plugin: Plugin): Dependencies {
    // Infrastructure
    const dateParserFactory = new DefaultDateParserFactory();
    const dateRepositoryFactory = new DefaultDateRepositoryFactory(dateParserFactory);

    const settingsAdapter = new ObsidianSettingsAdapter(plugin);
    const fileAdapter = new ObsidianFileAdapter(plugin);
    const noteAdapter = new ObsidianNoteAdapter(plugin, dateRepositoryFactory);

    const settingsRepositoryFactory = new DefaultSettingsRepositoryFactory(settingsAdapter);
    const fileRepositoryFactory = new DefaultFileRepositoryFactory(fileAdapter);
    const noteRepositoryFactory = new DefaultNoteRepositoryFactory(noteAdapter, dateRepositoryFactory, settingsRepositoryFactory);

    // Business
    const nameBuilderFactory = new DefaultNameBuilderFactory(dateParserFactory);
    const variableFactory = new DefaultVariableFactory();
    const variableParserFactory = new DefaultVariableParserFactory(variableFactory, dateParserFactory);
    const dateManagerFactory = new DefaultDateManagerFactory(dateRepositoryFactory);
    const noteManagerFactory = new DefaultNoteManagerFactory(fileRepositoryFactory, noteRepositoryFactory, settingsRepositoryFactory);
    const periodicNoteManager = new DefaultPeriodicNoteManager(nameBuilderFactory, variableParserFactory, fileRepositoryFactory, noteRepositoryFactory);

    // Presentation
    const calendarService = new DefaultCalendarService(dateManagerFactory);
    const periodService = new DefaultPeriodService(periodicNoteManager);

    const calendarViewModel = new DefaultCalendarViewModel(calendarService);
    const dailyNoteViewModel = new DayPeriodNoteViewModel(periodService);
    const weeklyNoteViewModel = new WeekPeriodNoteViewModel(periodService);
    const monthlyNoteViewModel = new MonthPeriodNoteViewModel(periodService);
    const quarterlyNoteViewModel = new QuarterPeriodNoteViewModel(periodService);
    const yearlyNoteViewModel = new YearPeriodNoteViewModel(periodService);
    const notesViewModel = new DefaultNotesViewModel(noteManagerFactory);

    const commandHandlerFactory = new DefaultCommandHandlerFactory(
        noteManagerFactory,
        settingsRepositoryFactory,
        dateManagerFactory,
        calendarViewModel,
        weeklyNoteViewModel,
        dailyNoteViewModel
    );
    const contextMenuAdapter = new ObsidianContextMenuAdapter();

    return {
        calendarViewModel: calendarViewModel,
        dailyNoteViewModel: dailyNoteViewModel,
        weeklyNoteViewModel: weeklyNoteViewModel,
        monthlyNoteViewModel: monthlyNoteViewModel,
        quarterlyNoteViewModel: quarterlyNoteViewModel,
        yearlyNoteViewModel: yearlyNoteViewModel,
        notesViewModel: notesViewModel,
        dateManagerFactory: dateManagerFactory,
        dateParserFactory: dateParserFactory,
        settingsRepositoryFactory: settingsRepositoryFactory,
        commandHandlerFactory: commandHandlerFactory,
        contextMenuAdapter: contextMenuAdapter
    };
}
