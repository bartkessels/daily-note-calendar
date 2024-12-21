import {SettingItems} from 'src/plugin/settings/setting.items';
import {PluginSettingTab, Setting} from 'obsidian';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NotesSettings} from 'src/domain/models/settings/notes.settings';

export class NotesSettingItems extends SettingItems {
    constructor(
        readonly settingsTab: PluginSettingTab,
        private readonly settingsRepository: SettingsRepository<NotesSettings>
    ) {
        super(settingsTab);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading('Notes settings', 'Settings for the notes that are displayed below the calendar.');
        this.addDisplayDateTemplateSetting(settings.displayDateTemplate, async value => {
            settings.displayDateTemplate = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addUsePropertyForCreatedDateSetting(settings.useCreatedOnDateFromProperties, async value => {
            settings.useCreatedOnDateFromProperties = value;
            await this.settingsRepository.storeSettings(settings);
        });
    }

    private addDisplayDateTemplateSetting(value: string, onValueChange: (value: string) => void) {
        this.addDateParseSetting(
            'Display date template',
            'The template to use when displaying the date of the note.',
            'HH:mm',
            value,
            onValueChange
        );
    }

    private addUsePropertyForCreatedDateSetting(value: boolean, onValueChange: (value: boolean) => void) {
        new Setting(this.settingsTab.containerEl)
            .setName('Use property for created date')
            .setDesc('Use the property to determine the created date of the note.')
            .addToggle(component => component
                .setValue(value)
                .onChange(onValueChange)
            );
    }
}