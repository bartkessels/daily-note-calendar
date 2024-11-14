import {SettingItems} from 'src/plugin/settings/setting-items';
import {PluginSettingTab} from 'obsidian';
import {YearlyNoteSettings} from 'src/domain/models/settings';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import type {SettingUiModel} from 'src/plugin/model/setting.ui-model';

export class YearlyNoteSettingItems extends SettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        private readonly settingsRepository: SettingsRepository<YearlyNoteSettings>
    ) {
        super(settingsTab);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Yearly notes", "Yearly notes are created or opened by clicking on the year in the calendar.");
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
    name: 'Yearly note name template',
    description: 'Format example: yyyy',
    placeholder: 'yyyy',
    value: value
});

const templateFileSetting = (value: string): SettingUiModel => ({
    name: 'Yearly note template',
    description: 'The template used to create the yearly note',
    placeholder: 'Templates/yearly-note',
    value: value
});

const folderSetting = (value: string): SettingUiModel => ({
    name: 'Yearly notes folder',
    description: 'The folder where you store your yearly notes',
    placeholder: 'Yearly notes',
    value: value
});
