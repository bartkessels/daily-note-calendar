import {Enhancer} from 'src/domain/enhancers/enhancer';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {Day} from 'src/domain/models/day';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {WeekUiModel} from 'src/components/models/week.ui-model';
import {DayUiModel} from 'src/components/models/day.ui-model';
import {Event} from 'src/domain/events/event';

export class DailyNoteCalendarEnhancer extends Enhancer<CalendarUiModel> {
    constructor(
        private readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
        private readonly settingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>,
        private readonly nameBuilder: NameBuilder<Day>,
        private readonly fileAdapter: FileAdapter,
        private readonly event: Event<CalendarUiModel>
    ) {
        super(event);
    }

    override async enhance(value: CalendarUiModel): Promise<CalendarUiModel> {
        const generalSettings = await this.generalSettingsRepository.getSettings();

        if (!value?.currentMonth?.weeks || !generalSettings.displayNoteIndicator) {
            return value;
        }

        const settings = await this.settingsRepository.getSettings();
        const enhancedWeeks = await this.enhanceWeeks(value.currentMonth.weeks, settings);

        return {
            ...value,
            currentMonth: {
                ...value.currentMonth,
                weeks: enhancedWeeks
            }
        };
    }

    private async enhanceWeeks(weeks: WeekUiModel[], settings: DailyNotesPeriodicNoteSettings): Promise<WeekUiModel[]> {
        return await Promise.all(weeks.map(async week => await this.enhanceWeek(week, settings)));
    }

    private async enhanceWeek(week: WeekUiModel, settings: DailyNotesPeriodicNoteSettings): Promise<WeekUiModel> {
        const enhancedDays = await this.enhanceDays(week.days, settings);
        return { ...week, days: enhancedDays };
    }

    private async enhanceDays(days: DayUiModel[], settings: DailyNotesPeriodicNoteSettings): Promise<DayUiModel[]> {
        return await Promise.all(days.map(async day => {
            return await this.enhanceDay(day, settings);
        }));
    }

    private async enhanceDay(day: DayUiModel, settings: DailyNotesPeriodicNoteSettings): Promise<DayUiModel> {
        if (!day.currentDay) {
            return day;
        }

        const filePath = this.nameBuilder
            .withPath(settings.folder)
            .withNameTemplate(settings.nameTemplate)
            .withValue(day.currentDay)
            .build();
        const hasNote = await this.fileAdapter.doesFileExist(filePath);

        return {
            ...day,
            hasNote: hasNote
        }

    }
}