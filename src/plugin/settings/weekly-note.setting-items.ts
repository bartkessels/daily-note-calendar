import {SettingItems} from 'src/plugin/settings/setting-items';
import {PluginSettingTab} from 'obsidian';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {WeeklyNoteSettings} from 'src/domain/models/settings';
import type {SettingUiModel} from 'src/plugin/model/setting.ui-model';

export class WeeklyNoteSettingItems extends SettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        private readonly settingsRepository: SettingsRepository<WeeklyNoteSettings>
    ) {
        super(settingsTab);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Weekly notes", "Weekly notes are created or opened by clicking on the week number in the calendar.");
        this.addSetting(nameTemplateSetting(settings.nameTemplate), async value => {
            settings.nameTemplate = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addSetting(templateFileSetting(settings.templateFile), async value => {
            settings.templateFile = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addSetting(folderSetting(settings.folder), async value => {
            settings.folder = value;
            await this.settingsRepository.storeSettings(settings);
        });
    }
}

const nameTemplateSetting = (value: string): SettingUiModel => ({
    name: 'Weekly note name template',
    description: 'Format example: yyyy - ww',
    placeholder: 'yyyy - ww',
    value: value
});

const templateFileSetting = (value: string): SettingUiModel => ({
    name: 'Weekly note template',
    description: 'The template used to create the weekly note',
    placeholder: 'Templates/weekly-note',
    value: value
});

const folderSetting = (value: string): SettingUiModel => ({
    name: 'Weekly notes folder',
    description: 'The folder where you store your weekly notes',
    placeholder: 'Weekly notes',
    value: value
});
