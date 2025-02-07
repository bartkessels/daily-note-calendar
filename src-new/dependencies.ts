import {ObsidianSettingsAdapter} from 'src-new/infrastructure/obsidian/obsidian.settings-adapter';
import {Plugin} from 'obsidian';
import {DefaultSettingsRepositoryFactory} from 'src-new/infrastructure/factories/default.settings-repository.factory';
import {DefaultNameBuilderFactory} from 'src-new/business/factories/default.name-builder-factory';
import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';
import {DefaultVariableParserFactory} from 'src-new/business/factories/default.variable-parser-factory';
import {Period} from 'src-new/domain/models/period.model';
import {DefaultDateParserFactory} from 'src-new/infrastructure/factories/default.date-parser-factory';
import {ObsidianFileAdapter} from 'src-new/infrastructure/obsidian/obsidian.file-adapter';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';
import {DefaultVariableFactory} from 'src-new/business/factories/default.variable-factory';
import {NumberOfNotesPeriodEnhancer} from 'src-new/presentation/enhancers/number-of-notes.period-enhancer';
import {NoteAdapter} from 'src-new/infrastructure/adapters/note.adapter';
import {PeriodicNoteExistsPeriodEnhancer} from 'src-new/presentation/enhancers/periodic-note-exists.period-enhancer';
import {CalendarEnhancer} from 'src-new/presentation/contracts/calendar.enhancer';
import {PeriodCalendarEnhancer} from 'src-new/presentation/enhancers/period.calendar-enhancer';
import {PluginSettings} from 'src-new/domain/settings/plugin.settings';
import {ObsidianNoteAdapter} from 'src-new/infrastructure/obsidian/obsidian.note-adapter';
import {CalendarViewModel, DefaultCalendarViewModel} from 'src-new/presentation/view-models/calendar.view-model';
import {DefaultCalendarService} from 'src-new/presentation/services/default.calendar-service';
import {RepositoryDateManager} from 'src-new/business/managers/repository.date-manager';
import {DefaultPeriodicNoteManager} from 'src-new/business/managers/default.periodic-note-manager';
import {DefaultDateRepositoryFactory} from 'src-new/infrastructure/factories/default.date-repository-factory';
import {DefaultFileRepositoryFactory} from 'src-new/infrastructure/factories/default.file-repository-factory';
import {SettingsRepositoryFactory} from 'src-new/infrastructure/contracts/settings-repository-factory';

export interface Dependencies {
    viewModel: CalendarViewModel;
    settingsRepositoryFactory: SettingsRepositoryFactory;
}

export function hoi(plugin: Plugin): Dependencies {
    // Infrastructure
    const settingsAdapter = new ObsidianSettingsAdapter(plugin);
    const fileAdapter = new ObsidianFileAdapter(plugin);
    const noteAdapter = new ObsidianNoteAdapter(plugin);

    const dateParserFactory = new DefaultDateParserFactory();
    const dateRepositoryFactory = new DefaultDateRepositoryFactory();
    const settingsRepositoryFactory = new DefaultSettingsRepositoryFactory(settingsAdapter);
    const fileRepositoryFactory = new DefaultFileRepositoryFactory(fileAdapter);

    // Business
    const nameBuilderFactory = new DefaultNameBuilderFactory(dateParserFactory);
    const variableFactory = new DefaultVariableFactory();
    const variableParserFactory = new DefaultVariableParserFactory(variableFactory, dateParserFactory);
    const dateManager = new RepositoryDateManager(dateRepositoryFactory);
    const periodicNoteManager = new DefaultPeriodicNoteManager(nameBuilderFactory, variableParserFactory, fileRepositoryFactory);

    // Presentation
    const calendarEnhancer = buildCalendarEnhancer(nameBuilderFactory, noteAdapter, fileAdapter);
    const calendarService = new DefaultCalendarService(dateManager, periodicNoteManager, calendarEnhancer);
    const viewModel = new DefaultCalendarViewModel(calendarService);

    return {
        viewModel,
        settingsRepositoryFactory
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