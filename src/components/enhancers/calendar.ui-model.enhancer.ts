import {Enhancer} from 'src/components/enhancers/enhancer';
import {CalendarUiModel} from 'src/components/calendar.ui-model';
import {DayUiModel} from 'src/components/day.ui-model';
import {WeekUiModel} from 'src/components/week.ui-model';

export class CalendarUiModelEnhancer implements Enhancer<CalendarUiModel> {
    constructor(
        private readonly dayEnhancer: Enhancer<DayUiModel>,
        private readonly weekEnhancer: Enhancer<WeekUiModel>
    ) {

    }

    public async enhance(calendar?: CalendarUiModel): Promise<CalendarUiModel | undefined> {
        if (!calendar?.currentMonth?.weeks) {
            return calendar;
        }

        const enhancedWeeks = await this.enhanceWeeks(calendar.currentMonth.weeks);

        return {
            ...calendar,
            currentMonth: {
                ...calendar.currentMonth,
                weeks: enhancedWeeks
            }
        };
    }

    private async enhanceWeeks(weeks: WeekUiModel[]): Promise<WeekUiModel[]> {
        let enhancedWeeks = [];

        for (const week of weeks) {
            let enhancedWeek = await this.weekEnhancer.enhance(week);

            if (enhancedWeek) {
                enhancedWeek.days = await this.enhanceDays(week.days);
                enhancedWeeks.push(enhancedWeek);
            } else {
                console.log(week);
                enhancedWeeks.push(week);
            }
        }

        return enhancedWeeks;
    }

    private async enhanceDays(days: DayUiModel[]): Promise<DayUiModel[]> {
        let enhancedDays = [];

        for (const day of days) {
            const enhancedDay = await this.dayEnhancer.enhance(day);

            if (enhancedDay) {
                enhancedDays.push(enhancedDay);
            }
        }

        return enhancedDays;
    }
}