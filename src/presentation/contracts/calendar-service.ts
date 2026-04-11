import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {Week} from 'src/domain/models/week';
import {Period} from 'src/domain/models/period.model';

export interface CalendarService {
    initialize(settings: PluginSettings): void;
    getCurrentWeek(): Week[];
    getPreviousWeek(weeks: Week[]): Week[];
    getNextWeek(weeks: Week[]): Week[];
    getPreviousMonth(weeks: Week[]): Week[];
    getNextMonth(weeks: Week[]): Week[];
    getMonthForWeeks(weeks: Week[], today: Period | null): Period;
    getQuarterForWeeks(weeks: Week[], today: Period | null): Period;
    getYearForWeeks(weeks: Week[], today: Period | null): Period;
}