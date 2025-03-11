import {PluginSettingTab} from 'obsidian';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {SettingUiModel} from 'src/presentation/settings/settings-view';
import {PeriodicNoteSettingsView} from 'src/presentation/settings/period-notes/periodic-note.settings-view';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';

export class MonthlyNotePeriodicNoteSettingsView extends PeriodicNoteSettingsView {
    override title = "Monthly notes";
    override description = "Monthly notes are created or opened by clicking on any month name in the calendar.";

    constructor(
        settingsTab: PluginSettingTab,
        dateParserFactory: DateParserFactory,
        settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        const settingsRepository = settingsRepositoryFactory.getRepository<PeriodNoteSettings>(SettingsType.MonthlyNote);

        super(settingsTab, settingsRepository, dateParserFactory.getParser());
    }

    override getNameTemplateSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Monthly note name template',
            description: 'The template used to create the monthly note name.',
            placeholder: 'yyyy - MM',
            value: value
        };
    }

    override getFolderSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Monthly notes folder',
            description: 'The folder where you store your monthly notes.',
            placeholder: 'Monthly notes',
            value: value
        };
    }

    override getTemplateFileSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Monthly note template',
            description: 'The template used to create the monthly note.',
            placeholder: 'Templates/monthly-note',
            value: value
        };
    }
}