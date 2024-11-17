import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PluginSettingTab} from 'obsidian';
import {PeriodicNoteSettingItems} from 'src/plugin/settings/periodic-note-setting-items';
import {PeriodicNoteSettingUiModel} from 'src/plugin/model/periodic-note-setting-ui.model';
import {MonthlyNoteSettings, PeriodicNoteSettings} from 'src/domain/models/settings';
import {DateParser} from 'src/domain/parsers/date.parser';

export class MonthlyNoteSettingItems extends PeriodicNoteSettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        dateParser: DateParser,
        private readonly settingsRepository: SettingsRepository<MonthlyNoteSettings>
    ) {
        super(settingsTab, dateParser);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Monthly notes", "Monthly notes are created or opened by clicking on any month name in the calendar.");
        this.addDateParseSetting(nameTemplateSetting(settings.nameTemplate), async value => {
            settings.nameTemplate = value;
            await this.settingsRepository.storeSettings(settings);
        });

        this.addDateParseSetting(folderSetting(settings.folder), async value => {
            settings.folder = value;
            await this.settingsRepository.storeSettings(settings);
        });

        this.addSetting(templateFileSetting(settings.templateFile), async value => {
            settings.templateFile = value;
            await this.settingsRepository.storeSettings(settings);
        });
    }
}

const nameTemplateSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Monthly note name template',
    description: 'Format example:',
    placeholder: 'yyyy - MM',
    value: value
});

const folderSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Monthly notes folder',
    description: 'The folder where you store your monthly notes:',
    placeholder: 'Monthly notes',
    value: value
});

const templateFileSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Monthly note template',
    description: 'The template used to create the daily note',
    placeholder: 'Templates/monthly-note',
    value: value
});
