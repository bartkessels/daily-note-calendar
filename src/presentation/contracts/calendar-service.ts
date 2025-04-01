import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {WeekModel} from 'src/domain/models/week.model';
import {Period} from 'src/domain/models/period.model';

export interface CalendarService {
    initialize(settings: PluginSettings): void;
    getCurrentWeek(): WeekModel[];
    getPreviousWeek(weeks: WeekModel[]): WeekModel[];
    getNextWeek(weeks: WeekModel[]): WeekModel[];
    getPreviousMonth(weeks: WeekModel[]): WeekModel[];
    getNextMonth(weeks: WeekModel[]): WeekModel[];
    getMonthForWeeks(weeks: WeekModel[]): Period;
    getQuarterForWeeks(weeks: WeekModel[]): Period;
    getYearForWeeks(weeks: WeekModel[]): Period;
}