import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {Day} from 'src/domain/models/day';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {DayUiModel} from 'src/components/models/day.ui-model';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';
import {WeekUiModel} from 'src/components/models/week.ui-model';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';

export class CalendarDayEnhancerStep implements EnhancerStep<CalendarUiModel> {
    constructor(
        private readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
        private readonly settingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>,
        private readonly nameBuilder: NameBuilder<Day>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async execute(calendar?: CalendarUiModel): Promise<CalendarUiModel | undefined> {
        const generalSettings = await this.generalSettingsRepository.getSettings();

        if (!calendar?.currentMonth?.weeks || !generalSettings.displayNoteIndicator) {
            return calendar;
        }

        const settings = await this.settingsRepository.getSettings();
        const enhancedWeeks = await this.enhanceWeeks(calendar.currentMonth.weeks, settings);

        return {
            ...calendar,
            currentMonth: {
                ...calendar.currentMonth,
                weeks: enhancedWeeks
            }
        };
    }

    private async enhanceWeeks(weeks: WeekUiModel[], settings: PeriodicNoteSettings): Promise<WeekUiModel[]> {
        return await Promise.all(weeks.map(async week => {
            const enhancedDays = await this.enhanceDays(week.days, settings);
            return {
                ...week,
                days: enhancedDays
            };
        }));
    }

    private async enhanceDays(days: DayUiModel[], settings: PeriodicNoteSettings): Promise<DayUiModel[]> {
        return await Promise.all(days.map(async day => {
            return await this.enhanceDay(day, settings);
        }));
    }

    private async enhanceDay(day: DayUiModel, settings: PeriodicNoteSettings): Promise<DayUiModel> {
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