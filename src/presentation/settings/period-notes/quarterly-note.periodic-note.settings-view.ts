import { SettingUiModel } from 'src/presentation/settings/settings-view';
import { PluginSettingTab } from 'obsidian';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {PeriodicNoteSettingsView} from 'src/presentation/settings/period-notes/periodic-note.settings-view';

export class QuarterlyNotePeriodicNoteSettingsView extends PeriodicNoteSettingsView {
    override title = "Quarterly notes";
    override description = "Quarterly notes are created or opened by clicking on a quarter in the upper-left corner of the calendar.";

    constructor(
        settingsTab: PluginSettingTab,
        dateParserFactory: DateParserFactory,
        settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        const settingsRepository = settingsRepositoryFactory.getRepository<PeriodNoteSettings>(SettingsType.QuarterlyNote);

        super(settingsTab, settingsRepository, dateParserFactory.getParser());
    }

    override getNameTemplateSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Quarterly note name template',
            description: 'The template used to create the quarterly note name.',
            placeholder: 'yyyy - qqq',
            value: value
        };
    }

    override getFolderSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Quarterly notes folder',
            description: 'The folder where you store your quarterly notes.',
            placeholder: 'Quarterly notes',
            value: value
        };
    }

    override getTemplateFileSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Quarterly note template',
            description: 'The template used to create the quarterly note.',
            placeholder: 'Templates/quarterly-note',
            value: value
        };
    }
}