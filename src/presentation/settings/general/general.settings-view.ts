import {SettingsView, SettingUiModel} from 'src/presentation/settings/settings-view';
import {PluginSettingTab, Setting} from 'obsidian';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DayOfWeek, dayOfWeekName} from 'src-old/domain/models/day';
import {GeneralSettings} from 'src/domain/settings/general.settings';

export class GeneralSettingsView extends SettingsView {
    override title = "General";
    override description = "General settings for the Daily Note Calendar plugin.";

    constructor(
        protected readonly settingsTab: PluginSettingTab,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        super(settingsTab);
    }

    override async addSettings(): Promise<void> {
        const settingsRepository = this.settingsRepositoryFactory
            .getRepository<GeneralSettings>(SettingsType.General);
        const settings = await settingsRepository.get();

        this.addBooleanSetting(this.getNotesCreatedOnDateSetting(settings.displayNotesCreatedOnDate), async value => {
            settings.displayNotesCreatedOnDate = value;
            await settingsRepository.store(settings);
        });
        this.addBooleanSetting(this.getDisplayNoteIndicatorSetting(settings.displayNoteIndicator), async value => {
            settings.displayNoteIndicator = value;
            await settingsRepository.store(settings);
        });
        this.addStartDayOfWeekSetting(settings.firstDayOfWeek, async value => {
            settings.firstDayOfWeek = value;
            await settingsRepository.store(settings);
        });
        this.addBooleanSetting(this.getUseModifierKeyToCreateNoteSetting(settings.useModifierKeyToCreateNote), async value => {
            settings.useModifierKeyToCreateNote = value;
            await settingsRepository.store(settings);
        });
    }

    private getNotesCreatedOnDateSetting(value: boolean): SettingUiModel<boolean> {
        return <SettingUiModel<boolean>> {
            name: 'Display notes created on selected date',
            description: 'When selecting a specific date in the calender, display all the notes created on that date below the calendar.',
            placeholder: '',
            value: value
        };
    }

    private getDisplayNoteIndicatorSetting(value: boolean): SettingUiModel<boolean> {
        return <SettingUiModel<boolean>> {
            name: 'Display an indicator on each date that has a note',
            description: 'Display an indicator below the date or week number if the date has a note.',
            placeholder: '',
            value: value
        };
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

    private getUseModifierKeyToCreateNoteSetting(value: boolean): SettingUiModel<boolean> {
        return <SettingUiModel<boolean>> {
            name: 'Use modifier key to create a note',
            description: 'Use a modifier key to create a note instead of clicking on the date.',
            placeholder: '',
            value: value
        };
    }
}