import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PluginSettingTab} from 'obsidian';
import {SettingItems} from 'src/plugin/settings/setting-items';
import {SettingUiModel} from 'src/plugin/model/setting.ui-model';
import {MonthlyNoteSettings} from 'src/domain/models/settings';

export class MonthlyNoteSettingItems extends SettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        private readonly settingsRepository: SettingsRepository<MonthlyNoteSettings>
    ) {
        super(settingsTab);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Monthly notes", "Monthly notes are created or opened by clicking on any month name in the calendar.");
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
    name: 'Monthly note name template',
    description: 'Format example: yyyy - MM',
    placeholder: 'yyyy - MM',
    value: value
});

const templateFileSetting = (value: string): SettingUiModel => ({
    name: 'Monthly note template',
    description: 'The template used to create the daily note',
    placeholder: 'Templates/monthly-note',
    value: value
});

const folderSetting = (value: string): SettingUiModel => ({
    name: 'Monthly notes folder',
    description: 'The folder where you store your monthly notes',
    placeholder: 'Monthly notes',
    value: value
});
