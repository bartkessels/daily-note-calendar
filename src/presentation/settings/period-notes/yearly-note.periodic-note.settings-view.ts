import { SettingUiModel } from 'src/presentation/settings/settings-view';
import { PluginSettingTab } from 'obsidian';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {PeriodicNoteSettingsView} from 'src/presentation/settings/period-notes/periodic-note.settings-view';

export class YearlyNotePeriodicNoteSettingsView extends PeriodicNoteSettingsView {
    override title = "Yearly notes";
    override description = "Yearly notes are created or opened by clicking on the week number in the calendar.";

    constructor(
        settingsTab: PluginSettingTab,
        dateParserFactory: DateParserFactory,
        settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        const settingsRepository = settingsRepositoryFactory.getRepository<PeriodNoteSettings>(SettingsType.YearlyNote);

        super(settingsTab, settingsRepository, dateParserFactory.getParser());
    }

    override getNameTemplateSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Yearly note name template',
            description: 'The template used to create the yearly note name.',
            placeholder: 'yyyy',
            value: value
        };
    }

    override getFolderSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Yearly notes folder',
            description: 'The folder where you store your yearly notes.',
            placeholder: 'Yearly notes',
            value: value
        };
    }

    override getTemplateFileSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Yearly note template',
            description: 'The template used to create the yearly note.',
            placeholder: 'Templates/yearly-note',
            value: value
        };
    }
}