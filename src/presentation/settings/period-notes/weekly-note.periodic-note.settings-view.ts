import { SettingUiModel } from 'src/presentation/settings/settings-view';
import { PluginSettingTab } from 'obsidian';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import { DateParserFactory } from 'src/infrastructure/contracts/date-parser-factory';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {PeriodicNoteSettingsView} from 'src/presentation/settings/period-notes/periodic-note.settings-view';

export class WeeklyNotePeriodicNoteSettingsView extends PeriodicNoteSettingsView {
    override title = "Weekly notes";
    override description = "Weekly notes are created or opened by clicking on the week number in the calendar.";

    constructor(
        settingsTab: PluginSettingTab,
        dateParserFactory: DateParserFactory,
        settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        const settingsRepository = settingsRepositoryFactory.getRepository<PeriodNoteSettings>(SettingsType.WeeklyNote);

        super(settingsTab, settingsRepository, dateParserFactory.getParser());
    }

    override getNameTemplateSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Weekly note name template',
            description: 'The template used to create the weekly note name.',
            placeholder: 'yyyy - ww',
            value: value
        };
    }

    override getFolderSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Weekly notes folder',
            description: 'The folder where you store your weekly notes.',
            placeholder: 'Weekly notes',
            value: value
        };
    }

    override getTemplateFileSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Weekly note template',
            description: 'The template used to create the weekly note.',
            placeholder: 'Templates/weekly-note',
            value: value
        };
    }
}