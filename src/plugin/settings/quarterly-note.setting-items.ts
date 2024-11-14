import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PluginSettingTab} from 'obsidian';
import {SettingItems} from 'src/plugin/settings/setting-items';
import {SettingUiModel} from 'src/plugin/model/setting.ui-model';
import {QuarterlyNoteSettings} from 'src/domain/models/settings';

export class QuarterlyNoteSettingItems extends SettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        private readonly settingsRepository: SettingsRepository<QuarterlyNoteSettings>
    ) {
        super(settingsTab);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Quarterly notes", "Quarterly notes are created or opened by clicking on a quarter in the upper-left corner of the calendar.");
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
    name: 'Quarterly note name template',
    description: 'Format example: yyyy - qqq',
    placeholder: 'yyyy - qqq',
    value: value
});

const templateFileSetting = (value: string): SettingUiModel => ({
    name: 'Quarterly note template',
    description: 'The template used to create the quarterly note',
    placeholder: 'Templates/quarterly-note',
    value: value
});

const folderSetting = (value: string): SettingUiModel => ({
    name: 'Quarterly notes folder',
    description: 'The folder where you store your quarterly notes',
    placeholder: 'Quarterly notes',
    value: value
});
