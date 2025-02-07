import { PluginSettings } from 'src/domain/settings/plugin.settings';
import {CalendarEnhancer} from 'src/presentation/contracts/calendar.enhancer';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';

export class PeriodCalendarEnhancer implements CalendarEnhancer {
    private readonly periodEnhancers: PeriodEnhancer[] = [];
    private settings?: PluginSettings;

    public withPeriodEnhancer(periodEnhancer: PeriodEnhancer): PeriodCalendarEnhancer {
        this.periodEnhancers.push(periodEnhancer);
        return this;
    }

    public withSettings(settings: PluginSettings): CalendarEnhancer {
        this.settings = settings;
        return this;
    }

    public async enhance(calendar: CalendarUiModel): Promise<CalendarUiModel> {
        if (!this.settings) {
            return calendar;
        }

        return {
            ...calendar,
            weeks: await this.enhanceWeeks(calendar.weeks, this.settings!!)
        };
    }

    private async enhanceWeeks(weeks: WeekUiModel[], settings: PluginSettings): Promise<WeekUiModel[]> {
        const enhancedWeeks = await this.periodEnhancers.reduce(async (week, enhancer) => {
            return enhancer
                .withSettings(settings.weeklyNotes)
                .enhance<WeekUiModel>(await week);
        }, Promise.resolve(weeks));

        return await Promise.all(enhancedWeeks.map(async week => {
            return {
                ...week,
                days: await this.enhanceDays(week.days, settings.dailyNotes)
            };
        }));
    }

    private async enhanceDays(days: PeriodUiModel[], settings: PeriodNoteSettings): Promise<PeriodUiModel[]> {
        return await this.periodEnhancers.reduce(async (day, enhancer) => {
            return enhancer
                .withSettings(settings)
                .enhance(await day);
        }, Promise.resolve(days));
    }
}