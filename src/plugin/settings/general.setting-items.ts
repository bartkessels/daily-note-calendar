import {SettingItems} from 'src/plugin/settings/setting.items';
import {PluginSettingTab, Setting} from 'obsidian';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';

export class GeneralSettingItems extends SettingItems {
    constructor(
        readonly settingsTab: PluginSettingTab,
        private readonly settingsRepository: SettingsRepository<GeneralSettings>
    ) {
        super(settingsTab);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading('General settings', 'General settings for the daily note calendar.');
        this.addNotesCreatedOnDateSetting(settings.displayNotesCreatedOnDate, async value => {
            settings.displayNotesCreatedOnDate = value;
            await this.settingsRepository.storeSettings(settings);
        });
    }

    private addNotesCreatedOnDateSetting(value: boolean, onValueChange: (value: boolean) => void) {
        new Setting(this.settingsTab.containerEl)
            .setName('Display notes created on selected date')
            .setDesc('When selecting a specific date in the calender, display all the notes created on that date below the calendar.')
            .addToggle(component => component
                .setValue(value)
                .onChange(onValueChange)
            );
    }
}