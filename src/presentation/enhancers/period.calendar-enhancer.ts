import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarEnhancer} from 'src/presentation/contracts/calendar.enhancer';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export class PeriodCalendarEnhancer implements CalendarEnhancer {
    private readonly dailyNoteEnhancers: PeriodEnhancer[] = [];
    private readonly weeklyNoteEnhancers: PeriodEnhancer[] = [];
    private settings?: PluginSettings;

    public withWeeklyNoteEnhancer(weeklyNoteEnhancer: PeriodEnhancer): PeriodCalendarEnhancer {
        this.weeklyNoteEnhancers.push(weeklyNoteEnhancer);
        return this;
    }

    public withDailyNoteEnhancer(dailyNoteEnhancer: PeriodEnhancer): PeriodCalendarEnhancer {
        this.dailyNoteEnhancers.push(dailyNoteEnhancer);
        return this;
    }

    public withSettings(settings: PluginSettings): CalendarEnhancer {
        this.settings = settings;
        return this;
    }

    public async enhance(calendar: CalendarUiModel): Promise<CalendarUiModel> {
        const settings = this.settings;

        if (!settings) {
            return calendar;
        }

        // const enhancedWeeks = await this.enhanceWeeks(calendar.weeks, settings);

        return {
            ...calendar,
            lastUpdateRequest: new Date(),
            // weeks: enhancedWeeks
        };
    }

    // private async enhanceWeeks(weeks: WeekUiModel[], settings: PluginSettings): Promise<WeekUiModel[]> {
    //     let enhancedWeeks = weeks;
    //
    //     for (const enhancer of this.weeklyNoteEnhancers) {
    //         enhancedWeeks = await enhancer
    //             .withSettings(settings)
    //             .enhance<WeekUiModel>(enhancedWeeks as PeriodUiModel[]);
    //     }
    //
    //     return await Promise.all(enhancedWeeks.map(async week => {
    //         return {
    //             ...week,
    //             days: await this.enhanceDays(week.days, settings)
    //         };
    //     }));
    // }
    //
    // private async enhanceDays(days: PeriodUiModel[], settings: PluginSettings): Promise<PeriodUiModel[]> {
    //     let enhancedDays = days;
    //
    //     for (const enhancer of this.dailyNoteEnhancers) {
    //         enhancedDays = await enhancer
    //             .withSettings(settings)
    //             .enhance<PeriodUiModel>(enhancedDays);
    //     }
    //
    //     return enhancedDays;
    // }
}