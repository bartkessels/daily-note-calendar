import {ObsidianSettingsAdapter} from 'src/infrastructure/obsidian/obsidian.settings-adapter';
import {Plugin} from 'obsidian';
import {DefaultSettingsRepositoryFactory} from 'src/infrastructure/factories/default.settings-repository-factory';
import {DefaultNameBuilderFactory} from 'src/business/factories/default.name-builder-factory';
import {NameBuilderType} from 'src/business/contracts/name-builder-factory';
import {DefaultVariableParserFactory} from 'src/business/factories/default.variable-parser-factory';
import {Period} from 'src/domain/models/period.model';
import {DefaultDateParserFactory} from 'src/infrastructure/factories/default.date-parser-factory';
import {ObsidianFileAdapter} from 'src/infrastructure/obsidian/obsidian.file-adapter';
import {DefaultVariableFactory} from 'src/business/factories/default.variable-factory';
import {ObsidianNoteAdapter} from 'src/infrastructure/obsidian/obsidian.note-adapter';
import {CalendarViewModel, DefaultCalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
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
import { PeriodNoteExistsPeriodEnhancer } from 'src/presentation/enhancers/period-note-exists.period-enhancer';
import {WeekUiModelBuilder} from 'src/presentation/builders/week-ui-model-builder';
import { CalendarUiModelBuilder } from './presentation/builders/calendar.ui-model.builder';
import {PeriodUiModelBuilder} from 'src/presentation/builders/period.ui-model-builder';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {DefaultNotesViewModel, NotesViewModel} from 'src/presentation/view-models/notes.view-model';
import {NotesUiModelBuilder} from 'src/presentation/builders/notes.ui-model-builder';

export interface Dependencies {
    calendarViewModel: CalendarViewModel;
    notesViewModel: NotesViewModel;
    dateManagerFactory: DateManagerFactory;
    dateParserFactory: DateParserFactory;
    settingsRepositoryFactory: SettingsRepositoryFactory;
    commandHandlerFactory: CommandHandlerFactory;
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
    const noteRepositoryFactory = new DefaultNoteRepositoryFactory(noteAdapter, dateParserFactory, settingsRepositoryFactory);

    // Business
    const nameBuilderFactory = new DefaultNameBuilderFactory(dateParserFactory);
    const variableFactory = new DefaultVariableFactory();
    const variableParserFactory = new DefaultVariableParserFactory(variableFactory, dateParserFactory);
    const dateManagerFactory = new DefaultDateManagerFactory(dateRepositoryFactory);
    const noteManagerFactory = new DefaultNoteManagerFactory(fileRepositoryFactory, noteRepositoryFactory, settingsRepositoryFactory);
    const periodicNoteManager = new DefaultPeriodicNoteManager(nameBuilderFactory, variableParserFactory, fileRepositoryFactory, noteRepositoryFactory);

    // Presentation
    const periodNoteExistsEnhancer = new PeriodNoteExistsPeriodEnhancer(nameBuilderFactory.getNameBuilder<Period>(NameBuilderType.PeriodicNote), fileAdapter);
    const periodUiModelBuilder = new PeriodUiModelBuilder(periodNoteExistsEnhancer);
    const weekUiModelBuilder = new WeekUiModelBuilder(periodNoteExistsEnhancer, periodUiModelBuilder);
    const notesUiModelBuilder = new NotesUiModelBuilder(dateParserFactory);

    const calendarUiModelBuilder = new CalendarUiModelBuilder(weekUiModelBuilder, periodUiModelBuilder);
    const calendarService = new DefaultCalendarService(dateManagerFactory, periodicNoteManager);
    const calendarViewModel = new DefaultCalendarViewModel(calendarService, calendarUiModelBuilder);
    const notesViewModel = new DefaultNotesViewModel(noteManagerFactory, notesUiModelBuilder);

    const commandHandlerFactory = new DefaultCommandHandlerFactory(noteManagerFactory, settingsRepositoryFactory, dateManagerFactory, calendarViewModel);

    return {
        calendarViewModel: calendarViewModel,
        notesViewModel: notesViewModel,
        dateManagerFactory: dateManagerFactory,
        dateParserFactory: dateParserFactory,
        settingsRepositoryFactory: settingsRepositoryFactory,
        commandHandlerFactory: commandHandlerFactory
    };
}
