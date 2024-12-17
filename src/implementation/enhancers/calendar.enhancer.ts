import {Enhancer} from 'src/domain/enhancers/enhancer';
import {CalendarUiModel} from 'src/components/calendar.ui-model';
import {DayUiModel} from 'src/components/day.ui-model';
import {WeekUiModel} from 'src/components/week.ui-model';

export class CalendarEnhancer extends Enhancer<CalendarUiModel> {
    constructor(
        private readonly dayEnhancer: Enhancer<DayUiModel[]>,
        private readonly weekEnhancer: Enhancer<WeekUiModel[]>
    ) {
        super();
    }

    public override async build(): Promise<CalendarUiModel | undefined> {
        if (!this.value?.currentMonth?.weeks) {
            return this.value;
        }

        const enhancedWeeks = await this.enhanceWeeks(this.value.currentMonth.weeks);

        return {
            ...this.value,
            currentMonth: {
                ...this.value.currentMonth,
                weeks: enhancedWeeks
            }
        };
    }

    private async enhanceWeeks(weeks: WeekUiModel[]): Promise<WeekUiModel[]> {
        const enhancedWeek = await this.weekEnhancer.withValue(weeks).build() ?? [];
        return await Promise.all(enhancedWeek.map(async (week) => {
            const enhancedDays = await this.dayEnhancer.withValue(week.days).build();

            if (enhancedDays) {
                return {
                    ...week,
                    days: enhancedDays
                }
            }
            return week;
        }));
    }
}