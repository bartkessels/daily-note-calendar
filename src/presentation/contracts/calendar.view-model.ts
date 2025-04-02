import {Calendar} from 'src/domain/models/calendar.model';
import {Period} from 'src/domain/models/period.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';

export interface CalendarViewModel {
    initialize(settings: PluginSettings, today: Period): void;
    getCurrentWeek(): Calendar;
    getPreviousWeek(calendar: Calendar): Calendar;
    getNextWeek(calendar: Calendar): Calendar;
    getPreviousMonth(calendar: Calendar): Calendar;
    getNextMonth(calendar: Calendar): Calendar;
}
