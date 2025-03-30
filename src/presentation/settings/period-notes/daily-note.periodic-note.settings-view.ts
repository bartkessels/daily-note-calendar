import {SettingUiModel} from 'src/presentation/settings/settings-view';
import {PluginSettingTab} from 'obsidian';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {PeriodicNoteSettingsView} from 'src/presentation/settings/period-notes/periodic-note.settings-view';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {DailyNoteSettingsRepository} from 'src/infrastructure/repositories/daily-note.settings-repository';

export class DailyNotePeriodicNoteSettingsView extends PeriodicNoteSettingsView {
    override title = "Daily notes";
    override description = "Daily notes are created or opened by clicking on any date in the calendar.";

    constructor(
        settingsTab: PluginSettingTab,
        dateParserFactory: DateParserFactory,
        settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        const settingsRepository = settingsRepositoryFactory.getRepository<PeriodNoteSettings>(SettingsType.DailyNote) as DailyNoteSettingsRepository;

        super(settingsTab, settingsRepository, dateParserFactory.getParser());
    }

    override getNameTemplateSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Daily note name template',
            description: 'The template used to create the daily note name.',
            placeholder: 'yyyy-MM-dd - eeee',
            value: value
        };
    }

    override getFolderSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Daily notes folder',
            description: 'The folder where you store your daily notes.',
            placeholder: `yyyy-'Daily notes'`,
            value: value
        };
    }

    override getTemplateFileSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Daily note template',
            description: 'The template used to create the daily note.',
            placeholder: 'Templates/daily-note',
            value: value
        };
    }
}