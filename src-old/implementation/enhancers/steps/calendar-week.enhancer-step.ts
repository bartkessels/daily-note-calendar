import {EnhancerStep} from 'src-old/domain/enhancers/enhancer-step';
import {CalendarUiModel} from 'src-old/components/models/calendar.ui-model';
import {WeeklyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/weekly-notes.periodic-note-settings';
import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import { NameBuilder } from 'src-old/domain/builders/name.builder';
import {Week} from 'src-old/domain/models/week';
import { FileAdapter } from 'src-old/domain/adapters/file.adapter';
import {WeekUiModel} from 'src-old/components/models/week.ui-model';
import {PeriodicNoteSettings} from 'src-old/domain/models/settings/periodic-note.settings';
import {GeneralSettings} from 'src-old/domain/models/settings/general.settings';
import {DayUiModel, EMPTY_DAY} from 'src-old/components/models/day.ui-model';
import { DayOfWeek } from 'src-old/domain/models/day';

export class CalendarWeekEnhancerStep implements EnhancerStep<CalendarUiModel> {
    private readonly START_MONDAY_ORDER = [
        DayOfWeek.Monday,
        DayOfWeek.Tuesday,
        DayOfWeek.Wednesday,
        DayOfWeek.Thursday,
        DayOfWeek.Friday,
        DayOfWeek.Saturday,
        DayOfWeek.Sunday
    ];
    private readonly START_SUNDAY_ORDER = [
        DayOfWeek.Sunday,
        DayOfWeek.Monday,
        DayOfWeek.Tuesday,
        DayOfWeek.Wednesday,
        DayOfWeek.Thursday,
        DayOfWeek.Friday,
        DayOfWeek.Saturday
    ];

    constructor(
        private readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
        private readonly settingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>,
        private readonly nameBuilder: NameBuilder<Week>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async execute(calendar?: CalendarUiModel): Promise<CalendarUiModel | undefined> {
        if (!calendar?.currentMonth?.weeks) {
            return calendar;
        }

        const settings = await this.settingsRepository.getSettings();
        const generalSettings = await this.generalSettingsRepository.getSettings();
        const enhancedWeeks = await this.enhanceWeeks(calendar.currentMonth.weeks, settings, generalSettings);

        return {
            ...calendar,
            startWeekOnMonday: generalSettings.firstDayOfWeek === DayOfWeek.Monday,
            currentMonth: {
                ...calendar.currentMonth,
                weeks: enhancedWeeks
            }
        };
    }
    
    private orderDays(days: DayUiModel[], settings: GeneralSettings): DayUiModel[] {
        const daysOrder = settings.firstDayOfWeek === DayOfWeek.Sunday
            ? this.START_SUNDAY_ORDER
            : this.START_MONDAY_ORDER;

        return daysOrder.map((dayOfWeek) =>
            days.find((day) => day.currentDay?.date.getDay() === dayOfWeek) ?? EMPTY_DAY
        );
    }

    private async enhanceWeeks(weeks: WeekUiModel[], settings: PeriodicNoteSettings, generalSettings: GeneralSettings): Promise<WeekUiModel[]> {
        return await Promise.all(weeks.map(async week => {
            return await this.enhanceWeek(week, settings, generalSettings);
        }));
    }

    private async enhanceWeek(week: WeekUiModel, settings: PeriodicNoteSettings, generalSettings: GeneralSettings): Promise<WeekUiModel> {
        if (!week.week) {
            return week;
        }

        const filePath = this.nameBuilder
            .withPath(settings.folder)
            .withNameTemplate(settings.nameTemplate)
            .withValue(week.week)
            .build();
        const hasNote = await this.fileAdapter.doesFileExist(filePath) && generalSettings.displayNoteIndicator;

        return {
            ...week,
            days: this.orderDays(week.days, generalSettings),
            hasNote: hasNote
        };
    }
}