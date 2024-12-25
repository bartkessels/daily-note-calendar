import {SettingItems} from 'src/plugin/settings/setting.items';
import {PluginSettingTab, Setting} from 'obsidian';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';
import { DateParser } from 'src/domain/parsers/date.parser';
import {DayOfWeek, dayOfWeekName} from 'src/domain/models/day';

export class GeneralSettingItems extends SettingItems {
    constructor(
        readonly settingsTab: PluginSettingTab,
        readonly dateParser: DateParser,
        private readonly settingsRepository: SettingsRepository<GeneralSettings>
    ) {
        super(settingsTab, dateParser);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading('General settings', 'General settings for the daily note calendar.');
        this.addNotesCreatedOnDateSetting(settings.displayNotesCreatedOnDate, async value => {
            settings.displayNotesCreatedOnDate = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addDisplayNoteIndicatorSetting(settings.displayNoteIndicator, async value => {
            settings.displayNoteIndicator = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addStartDayOfWeekSetting(settings.firstDayOfWeek, async value => {
            settings.firstDayOfWeek = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addUseModifierKeyToCreateNoteSetting(settings.useModifierKeyToCreateNote, async value => {
            settings.useModifierKeyToCreateNote = value;
            await this.settingsRepository.storeSettings(settings);
        });
    }

    private addNotesCreatedOnDateSetting(value: boolean, onValueChange: (value: boolean) => void): void {
        new Setting(this.settingsTab.containerEl)
            .setName('Display notes created on selected date')
            .setDesc('When selecting a specific date in the calender, display all the notes created on that date below the calendar.')
            .addToggle(component => component
                .setValue(value)
                .onChange(onValueChange)
            );
    }

    private addDisplayNoteIndicatorSetting(value: boolean, onValueChange: (value: boolean) => void): void {
        new Setting(this.settingsTab.containerEl)
            .setName('Display an indicator on each date that has a note')
            .setDesc('Display an indicator below the date or week number if the date has a note.')
            .addToggle(component => component
                .setValue(value)
                .onChange(onValueChange)
            );
    }

    private addStartDayOfWeekSetting(value: DayOfWeek, onValueChange: (value: DayOfWeek) => void): void {
        new Setting(this.settingsTab.containerEl)
            .setName('First day of the week')
            .setDesc('Set the first day of the week for the calendar.')
            .addDropdown(component => component
                .addOptions({
                    'sunday': dayOfWeekName(DayOfWeek.Sunday),
                    'monday': dayOfWeekName(DayOfWeek.Monday)
                })
                .setValue(dayOfWeekName(value).toLowerCase())
                .onChange((value) => {
                    if (value.toLowerCase() === 'sunday') {
                        onValueChange(DayOfWeek.Sunday);
                    } else {
                        onValueChange(DayOfWeek.Monday);
                    }
                })
            );
    }

    private addUseModifierKeyToCreateNoteSetting(value: boolean, onValueChange: (value: boolean) => void): void {
        new Setting(this.settingsTab.containerEl)
            .setName('Use the CTRL or CMD key to create note')
            .setDesc('When this setting is enabled, when clicking on a date in the calendar will only create a new note when either the CTRL or CMD key is pressed. Otherwise it will only open periodic notes.')
            .addToggle(component => component
                .setValue(value)
                .onChange(onValueChange)
            );
    }
}