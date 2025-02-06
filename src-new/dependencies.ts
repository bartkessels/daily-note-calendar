import {ObsidianSettingsAdapter} from 'src-new/infrastructure/obsidian/obsidian.settings-adapter';
import {Plugin} from 'obsidian';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {SettingsRepositoryFactory, SettingsType} from 'src-new/infrastructure/contracts/settings-repository-factory';
import {GeneralSettingsRepository} from 'src-new/infrastructure/repositories/general.settings-repository';
import {DefaultSettingsRepositoryFactory} from 'src-new/infrastructure/factories/default.settings-repository.factory';
import {DisplayNotesSettingsRepository} from 'src-new/infrastructure/repositories/display-notes.settings-repository';
import {DailyNoteSettingsRepository} from 'src-new/infrastructure/repositories/daily-note.settings.repository';
import {MonthlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/monthly-note.settings-repository';
import {QuarterlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/quarterly-note.settings-repository';
import {WeeklyNoteSettingsRepository} from 'src-new/infrastructure/repositories/weekly-note.settings-repository';
import {YearlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/yearly-note.settings-repository';
import {DisplayNotesSettings} from 'src-new/domain/settings/display-notes.settings';
import {GeneralSettings} from 'src-new/domain/settings/general.settings';
import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {DefaultNameBuilderFactory} from 'src-new/business/factories/default.name-builder-factory';
import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';
import {DefaultVariableParserFactory} from 'src-new/business/factories/default.variable-parser-factory';
import {PeriodNameBuilder} from 'src-new/business/builders/period.name-builder';
import {DateParser} from 'src-new/infrastructure/contracts/date-parser';
import {Period} from 'src-new/domain/models/period.model';
import {DateParserFactory} from 'src-new/infrastructure/contracts/date-parser-factory';
import {DateFnsDateParser} from 'src-new/infrastructure/parsers/date-fns.date-parser';
import {DefaultDateParserFactory} from 'src-new/infrastructure/factories/default.date-parser-factory';
import {ObsidianFileAdapter} from 'src-new/infrastructure/obsidian/obsidian.file-adapter';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';
import {VariableParserFactory} from 'src-new/business/contracts/variable-parser-factory';
import {ActiveFileVariableParser} from 'src-new/business/parsers/active-file.variable-parser';
import {PeriodVariableParser} from 'src-new/business/parsers/period.variable-parser';
import {TodayVariableParser} from 'src-new/business/parsers/today.variable-parser';
import {VariableFactory} from 'src-new/business/contracts/variable-factory';
import {VariableType} from 'src-new/domain/models/variable.model';
import {DefaultVariableFactory} from 'src-new/business/factories/default.variable-factory';
import {NumberOfNotesPeriodEnhancer} from 'src-new/presentation/enhancers/number-of-notes.period-enhancer';
import {NoteAdapter} from 'src-new/infrastructure/adapters/note.adapter';
import {PeriodicNoteExistsPeriodEnhancer} from 'src-new/presentation/enhancers/periodic-note-exists.period-enhancer';
import {CalendarEnhancer} from 'src-new/presentation/contracts/calendar.enhancer';
import {PeriodCalendarEnhancer} from 'src-new/presentation/enhancers/period.calendar-enhancer';
import {PluginSettings} from 'src-new/domain/settings/plugin.settings';
import {ObsidianNoteAdapter} from 'src-new/infrastructure/obsidian/obsidian.note-adapter';
import {PluginSettingsRepository} from 'src-new/infrastructure/repositories/plugin.settings-repository';
import {DefaultCalendarViewModel} from 'src-new/presentation/view-models/calendar.view-model';
import {DefaultCalendarService} from 'src-new/presentation/services/default.calendar-service';
import {RepositoryDateManager} from 'src-new/business/managers/repository.date-manager';
import {DefaultPeriodicNoteManager} from 'src-new/business/managers/default.periodic-note-manager';
import {DateFnsDateRepository} from 'src-new/infrastructure/repositories/date-fns.date-repository';
import {DefaultDateRepositoryFactory} from 'src-new/infrastructure/factories/default.date-repository-factory';

export async function hoi(plugin: Plugin) {
    // Infrastructure
    const settingsAdapter = new ObsidianSettingsAdapter(plugin);
    const fileAdapter = new ObsidianFileAdapter(plugin);
    const noteAdapter = new ObsidianNoteAdapter(plugin);

    const dateParserFactory = new DefaultDateParserFactory();
    const dateRepositoryFactory = new DefaultDateRepositoryFactory();
    const settingsRepositoryFactory = new DefaultSettingsRepositoryFactory(settingsAdapter);

    // Business



    // Business
    const nameBuilderFactory = buildNameBuilderFactory(dateParserFactory.getParser());
    const variableParserFactory = buildVariableParserFactory(dateParserFactory.getParser(), new DefaultVariableFactory());
    const dateManager = new RepositoryDateManager(dateRepositoryFactory);
    const periodicNoteManager = new DefaultPeriodicNoteManager(nameBuilderFactory, variableParserFactory, fileAdapter);

    // Presentation
    const calendarEnhancer = await buildCalendarEnhancer(nameBuilderFactory, settingsRepositoryFactory, noteAdapter, fileAdapter);
    const calendarService = new DefaultCalendarService(dateManager, periodicNoteManager, calendarEnhancer);
    const viewModel = new DefaultCalendarViewModel(calendarService);
}


function buildVariableParserFactory(dateParser: DateParser, variableFactory: VariableFactory): VariableParserFactory {
    const activeFileVariableParser = new ActiveFileVariableParser();
    const periodVariableParser = new PeriodVariableParser(variableFactory, dateParser);
    const todayVariableParser = new TodayVariableParser(variableFactory, dateParser);

    return new DefaultVariableParserFactory()
        .register<string>(VariableType.Title, activeFileVariableParser)
        .register<Period>(VariableType.Date, periodVariableParser)
        .register<Date>(VariableType.Today, todayVariableParser);
}

function buildNameBuilderFactory(dateParser: DateParser): NameBuilderFactory {
    const periodNameBuilder = new PeriodNameBuilder(dateParser);

    return new DefaultNameBuilderFactory()
        .register<Period>(NameBuilderType.PeriodicNote, periodNameBuilder);
}

async function buildCalendarEnhancer(
    nameBuilderFactory: NameBuilderFactory,
    settingsRepositoryFactory: SettingsRepositoryFactory,
    noteAdapter: NoteAdapter,
    fileAdapter: FileAdapter
): Promise<CalendarEnhancer> {
    const settings = await settingsRepositoryFactory.getRepository<PluginSettings>(SettingsType.Plugin).get();
    const numberOfNotesPeriodEnhancer = new NumberOfNotesPeriodEnhancer(noteAdapter);
    const periodicNoteExistsEnhancer = new PeriodicNoteExistsPeriodEnhancer(nameBuilderFactory.getNameBuilder<Period>(NameBuilderType.PeriodicNote), fileAdapter);

    return new PeriodCalendarEnhancer()
        .withPeriodEnhancer(numberOfNotesPeriodEnhancer)
        .withPeriodEnhancer(periodicNoteExistsEnhancer)
        .withSettings(settings);
}