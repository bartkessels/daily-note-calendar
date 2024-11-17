import {PeriodicNoteSettingItems} from 'src/plugin/settings/periodic-note-setting-items';
import {PluginSettingTab} from 'obsidian';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {WeeklyNoteSettings} from 'src/domain/models/settings';
import type {PeriodicNoteSettingUiModel} from 'src/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src/domain/parsers/date.parser';

export class WeeklyNoteSettingItems extends PeriodicNoteSettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        dateParser: DateParser,
        private readonly settingsRepository: SettingsRepository<WeeklyNoteSettings>
    ) {
        super(settingsTab, dateParser);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Weekly notes", "Weekly notes are created or opened by clicking on the week number in the calendar.");
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
    name: 'Weekly note name template',
    description: 'Format example:',
    placeholder: 'yyyy - ww',
    value: value
});

const folderSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Weekly notes folder',
    description: 'The folder where you store your weekly notes:',
    placeholder: 'Weekly notes',
    value: value
});

const templateFileSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Weekly note template',
    description: 'The template used to create the weekly note',
    placeholder: 'Templates/weekly-note',
    value: value
});
