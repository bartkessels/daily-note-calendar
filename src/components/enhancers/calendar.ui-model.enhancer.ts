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

        const enhancedWeeks = await Promise.all(calendar.currentMonth?.weeks.map(async (week) => {
            const enhancedWeek = await this.weekEnhancer.enhance(week);

            if (!enhancedWeek?.days) {
                return enhancedWeek;
            }

            return await Promise.all(enhancedWeek.days.map(async (day) => {
                return await this.dayEnhancer.enhance(day);
            })) as DayUiModel[];
        })) as WeekUiModel[];

        return {
            ...calendar,
            currentMonth: {
                ...calendar.currentMonth,
                weeks: enhancedWeeks
            }
        };
    }
}