import {SettingsView, SettingUiModel} from 'src/presentation/settings/settings-view';
import {PluginSettingTab, Setting} from 'obsidian';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {GeneralSettings} from 'src/domain/settings/general.settings';
import {DayOfWeek, WeekNumberStandard} from 'src/domain/models/week';

export class GeneralSettingsView extends SettingsView {
    override title = 'General';
    override description = 'General settings for the Daily Note Calendar plugin.';

    constructor(
        protected readonly settingsTab: PluginSettingTab,
        onSettingsChange: () => void,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        super(settingsTab, onSettingsChange);
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
        this.addWeekNumberStandardSetting(settings.weekNumberStandard, async value => {
            settings.weekNumberStandard = value;
            await settingsRepository.store(settings);
        });
        this.addBooleanSetting(this.getUseModifierKeyToCreateNoteSetting(settings.useModifierKeyToCreateNote), async value => {
            settings.useModifierKeyToCreateNote = value;
            await settingsRepository.store(settings);
        });
    }

    private getNotesCreatedOnDateSetting(value: boolean): SettingUiModel<boolean> {
        return <SettingUiModel<boolean>>{
            name: 'Display notes created on selected date',
            description: 'When selecting a specific date in the calender, display all the notes created on that date below the calendar.',
            placeholder: '',
            value: value
        };
    }

    private getDisplayNoteIndicatorSetting(value: boolean): SettingUiModel<boolean> {
        return <SettingUiModel<boolean>>{
            name: 'Display an indicator on each date that has a note',
            description: 'Display an indicator below the date or week number if the date has a note.',
            placeholder: '',
            value: value
        };
    }

    private addStartDayOfWeekSetting(value: DayOfWeek, onValueChange: (value: DayOfWeek) => Promise<void>): void {
        const options = new Map<string, string>();
        options.set('sunday', this.dayOfWeekName(DayOfWeek.Sunday));
        options.set('monday', this.dayOfWeekName(DayOfWeek.Monday));

        this.addDropdownSetting(
            'First day of the week',
            'Set the first day of the week for the calendar.',
            options,
            this.dayOfWeekName(value).toLowerCase(),
            async (value) => {
                if (value.toLowerCase() === 'sunday') {
                    return await onValueChange(DayOfWeek.Sunday);
                } else {
                    return await onValueChange(DayOfWeek.Monday);
                }
            }
        );
    }

    private addWeekNumberStandardSetting(value: WeekNumberStandard, onValueChange: (value: WeekNumberStandard) => Promise<void>): void {
        const options = new Map<string, string>();
        options.set('iso', this.weekNumberStandardName(WeekNumberStandard.ISO));
        options.set('us', this.weekNumberStandardName(WeekNumberStandard.US));

        this.addDropdownSetting(
            'Week number standard',
            'Set the week number standard for the calendar.',
            options,
            this.weekNumberStandardName(value).toLowerCase(),
            async (value) => {
                if (value.toLowerCase() === 'iso') {
                    return await onValueChange(WeekNumberStandard.ISO);
                } else {
                    return await onValueChange(WeekNumberStandard.US);
                }
            }
        );
    }

    private getUseModifierKeyToCreateNoteSetting(value: boolean): SettingUiModel<boolean> {
        return <SettingUiModel<boolean>>{
            name: 'Use modifier key to create a note',
            description: 'Use a modifier key to create a note instead of clicking on the date.',
            placeholder: '',
            value: value
        };
    }

    private dayOfWeekName(dayOfWeek: DayOfWeek): string {
        switch (dayOfWeek) {
            case DayOfWeek.Monday:
                return 'Monday';
            case DayOfWeek.Tuesday:
                return 'Tuesday';
            case DayOfWeek.Wednesday:
                return 'Wednesday';
            case DayOfWeek.Thursday:
                return 'Thursday';
            case DayOfWeek.Friday:
                return 'Friday';
            case DayOfWeek.Saturday:
                return 'Saturday';
            case DayOfWeek.Sunday:
                return 'Sunday';
        }
    }

    private weekNumberStandardName(standard: WeekNumberStandard): string {
        switch (standard) {
            case WeekNumberStandard.ISO:
                return 'ISO 8601';
            case WeekNumberStandard.US:
                return 'US';
        }
    }
}