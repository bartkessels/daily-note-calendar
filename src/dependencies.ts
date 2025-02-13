import {ObsidianSettingsAdapter} from 'src/infrastructure/obsidian/obsidian.settings-adapter';
import {Plugin} from 'obsidian';
import {DefaultSettingsRepositoryFactory} from 'src/infrastructure/factories/default.settings-repository.factory';
import {DefaultNameBuilderFactory} from 'src/business/factories/default.name-builder-factory';
import {NameBuilderFactory, NameBuilderType} from 'src/business/contracts/name-builder-factory';
import {DefaultVariableParserFactory} from 'src/business/factories/default.variable-parser-factory';
import {Period} from 'src/domain/models/period.model';
import {DefaultDateParserFactory} from 'src/infrastructure/factories/default.date-parser-factory';
import {ObsidianFileAdapter} from 'src/infrastructure/obsidian/obsidian.file-adapter';
import {FileAdapter} from 'src/infrastructure/adapters/file.adapter';
import {DefaultVariableFactory} from 'src/business/factories/default.variable-factory';
import {NumberOfNotesPeriodEnhancer} from 'src/presentation/enhancers/number-of-notes.period-enhancer';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {PeriodicNoteExistsPeriodEnhancer} from 'src/presentation/enhancers/periodic-note-exists.period-enhancer';
import {CalendarEnhancer} from 'src/presentation/contracts/calendar.enhancer';
import {PeriodCalendarEnhancer} from 'src/presentation/enhancers/period.calendar-enhancer';
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

export interface Dependencies {
    viewModel: CalendarViewModel;
    dateManagerFactory: DateManagerFactory;
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
    const noteRepositoryFactory = new DefaultNoteRepositoryFactory(noteAdapter);

    // Business
    const nameBuilderFactory = new DefaultNameBuilderFactory(dateParserFactory);
    const variableFactory = new DefaultVariableFactory();
    const variableParserFactory = new DefaultVariableParserFactory(variableFactory, dateParserFactory);
    const dateManagerFactory = new DefaultDateManagerFactory(dateRepositoryFactory);
    const noteManagerFactory = new DefaultNoteManagerFactory(fileRepositoryFactory, noteRepositoryFactory, settingsRepositoryFactory, dateRepositoryFactory);
    const periodicNoteManager = new DefaultPeriodicNoteManager(nameBuilderFactory, variableParserFactory, fileRepositoryFactory, noteRepositoryFactory);

    // Presentation
    const calendarEnhancer = buildCalendarEnhancer(nameBuilderFactory, noteAdapter, fileAdapter);
    const calendarService = new DefaultCalendarService(dateManagerFactory, periodicNoteManager, calendarEnhancer);
    const viewModel = new DefaultCalendarViewModel(calendarService);

    const commandHandlerFactory = new DefaultCommandHandlerFactory(noteManagerFactory, settingsRepositoryFactory, dateManagerFactory, viewModel);

    return {
        viewModel: viewModel,
        dateManagerFactory: dateManagerFactory,
        settingsRepositoryFactory: settingsRepositoryFactory,
        commandHandlerFactory: commandHandlerFactory
    };
}

function buildCalendarEnhancer(
    nameBuilderFactory: NameBuilderFactory,
    noteAdapter: NoteAdapter,
    fileAdapter: FileAdapter
): CalendarEnhancer {
    const numberOfNotesPeriodEnhancer = new NumberOfNotesPeriodEnhancer(noteAdapter);
    const periodicNoteExistsEnhancer = new PeriodicNoteExistsPeriodEnhancer(nameBuilderFactory.getNameBuilder<Period>(NameBuilderType.PeriodicNote), fileAdapter);

    return new PeriodCalendarEnhancer()
        .withPeriodEnhancer(numberOfNotesPeriodEnhancer)
        .withPeriodEnhancer(periodicNoteExistsEnhancer);
}