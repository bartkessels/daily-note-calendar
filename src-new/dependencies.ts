import {ObsidianSettingsAdapter} from 'src-new/infrastructure/obsidian/obsidian.settings-adapter';
import {Plugin} from 'obsidian';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {SettingsRepositoryFactory, SettingsType} from 'src-new/infrastructure/contracts/settings-repository-factory';
import {GeneralSettingsRepository} from 'src-new/infrastructure/repositories/general.settings-repository';
import {DefaultSettingsRepositoryFactory} from 'src-new/infrastructure/factories/default-settings-repository.factory';
import {DisplayNotesSettingsRepository} from 'src-new/infrastructure/repositories/display-notes.settings-repository';
import {DailyNoteSettingsRepository} from 'src-new/infrastructure/repositories/daily-note.settings.repository';
import {MonthlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/monthly-note.settings-repository';
import {QuarterlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/quarterly-note.settings-repository';
import {WeeklyNoteSettingsRepository} from 'src-new/infrastructure/repositories/weekly-note.settings-repository';
import {YearlyNoteSettingsRepository} from 'src-new/infrastructure/repositories/yearly-note.settings-repository';
import {DisplayNotesSettings} from 'src-new/domain/settings/display-notes.settings';
import {GeneralSettings} from 'src-new/domain/settings/general.settings';
import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {PeriodNoteManager} from 'src-new/business/managers/period-note.manager';
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

export function hoi(plugin: Plugin) {
    // Adapters
    const settingsAdapter = new ObsidianSettingsAdapter(plugin);
    const fileAdapter = new ObsidianFileAdapter(plugin);

    // Infrastructure
    const dateParserFactory = buildDateParserFactory();
    const settingsRepositoryFactory = buildSettingsRepositoryFactory(settingsAdapter);

    // Business
    const nameBuilderFactory = buildNameBuilderFactory(dateParserFactory.getParser());
    const variableParserFactory = buildVariableParserFactory(dateParserFactory.getParser(), new DefaultVariableFactory());
    const dayManager = buildPeriodManager(SettingsType.DailyNote, nameBuilderFactory, fileAdapter, settingsRepositoryFactory, variableParserFactory);
    const weekManager = buildPeriodManager(SettingsType.WeeklyNote, nameBuilderFactory, fileAdapter, settingsRepositoryFactory, variableParserFactory);
    const monthManager = buildPeriodManager(SettingsType.MonthlyNote, nameBuilderFactory, fileAdapter, settingsRepositoryFactory, variableParserFactory);
    const quarterManager = buildPeriodManager(SettingsType.QuarterlyNote, nameBuilderFactory, fileAdapter, settingsRepositoryFactory, variableParserFactory);
    const yearManager = buildPeriodManager(SettingsType.YearlyNote, nameBuilderFactory, fileAdapter, settingsRepositoryFactory, variableParserFactory);
}

function buildSettingsRepositoryFactory(adapter: SettingsAdapter): SettingsRepositoryFactory {
    const dailyNoteSettingsRepository = new DailyNoteSettingsRepository(adapter);
    const displayNotesSettingsRepository = new DisplayNotesSettingsRepository(adapter);
    const generalSettingsRepository = new GeneralSettingsRepository(adapter);
    const monthlyNoteSettingsRepository = new MonthlyNoteSettingsRepository(adapter);
    const quarterlyNoteSettingsRepository = new QuarterlyNoteSettingsRepository(adapter);
    const weeklyNoteSettingsRepository = new WeeklyNoteSettingsRepository(adapter);
    const yearlyNoteSettingsRepository = new YearlyNoteSettingsRepository(adapter);

    return new DefaultSettingsRepositoryFactory()
        .register<PeriodNoteSettings>(SettingsType.DailyNote, dailyNoteSettingsRepository)
        .register<DisplayNotesSettings>(SettingsType.DisplayNotes, displayNotesSettingsRepository)
        .register<GeneralSettings>(SettingsType.General, generalSettingsRepository)
        .register<PeriodNoteSettings>(SettingsType.MonthlyNote, monthlyNoteSettingsRepository)
        .register<PeriodNoteSettings>(SettingsType.QuarterlyNote, quarterlyNoteSettingsRepository)
        .register<PeriodNoteSettings>(SettingsType.WeeklyNote, weeklyNoteSettingsRepository)
        .register<PeriodNoteSettings>(SettingsType.YearlyNote, yearlyNoteSettingsRepository);
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

function buildDateParserFactory(): DateParserFactory {
    const dateFnsParser = new DateFnsDateParser();

    return new DefaultDateParserFactory()
        .register(dateFnsParser);
}

function buildPeriodManager(
    settingsType: SettingsType,
    nameBuilderFactory: NameBuilderFactory,
    fileAdapter: FileAdapter,
    settingsRepositoryFactory: SettingsRepositoryFactory,
    variableParserFactory: VariableParserFactory
): PeriodNoteManager {
    return new PeriodNoteManager(
        nameBuilderFactory,
        fileAdapter,
        settingsRepositoryFactory.getRepository<PeriodNoteSettings>(settingsType),
        variableParserFactory
    );
}