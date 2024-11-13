import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PluginSettingTab} from 'obsidian';
import {SettingItems} from 'src/plugin/settings/setting-items';
import {SettingUiModel} from 'src/plugin/model/setting.ui-model';
import {DailyNoteSettings} from 'src/domain/models/settings';

export class DailyNoteSettingItems extends SettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        private readonly settingsRepository: SettingsRepository<DailyNoteSettings>
    ) {
        super(settingsTab);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Daily notes", "Daily notes are created or opened by clicking on any date in the calendar.");
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
    name: 'Daily note name template',
    description: 'Format example: yyyy-MM-dd - eeee',
    placeholder: 'yyyy-MM-dd - eeee',
    value: value
});

const templateFileSetting = (value: string): SettingUiModel => ({
    name: 'Daily note template',
    description: 'The template used to create the daily note',
    placeholder: 'Templates/daily-note',
    value: value
});

const folderSetting = (value: string): SettingUiModel => ({
    name: 'Daily notes folder',
    description: 'The folder where you store your daily notes',
    placeholder: 'Daily notes',
    value: value
});
