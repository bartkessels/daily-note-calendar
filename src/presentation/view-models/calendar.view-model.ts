import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {DayOfWeek, Week} from 'src/domain/models/week';
import {Calendar} from 'src/domain/models/calendar.model';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';

export class DefaultCalendarViewModel implements CalendarViewModel {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private today: Period | null = null;

    constructor(
        private readonly calendarService: CalendarService
    ) {

    }

    public initialize(settings: PluginSettings, today: Period): void {
        this.settings = settings;
        this.today = today;

        this.calendarService.initialize(settings);
    }

    public getCurrentWeek(): Calendar {
        const currentWeek = this.calendarService.getCurrentWeek();
        return this.buildCalendar(currentWeek);
    }

    public getPreviousWeek(calendar: Calendar): Calendar {
        const previousWeek = this.calendarService.getPreviousWeek(calendar.weeks);
        return this.buildCalendar(previousWeek);
    }

    public getNextWeek(calendar: Calendar): Calendar {
        const nextWeek = this.calendarService.getNextWeek(calendar.weeks);
        return this.buildCalendar(nextWeek);
    }

    public getPreviousMonth(calendar: Calendar): Calendar {
        const previousMonth = this.calendarService.getPreviousMonth(calendar.weeks);
        return this.buildCalendar(previousMonth);
    }

    public getNextMonth(calendar: Calendar): Calendar {
        const nextMonth = this.calendarService.getNextMonth(calendar.weeks);
        return this.buildCalendar(nextMonth);
    }

    private buildCalendar(weeks: Week[]): Calendar {
        const startWeekOnMonday = this.settings.generalSettings.firstDayOfWeek === DayOfWeek.Monday;
        const month = this.calendarService.getMonthForWeeks(weeks);
        const quarter = this.calendarService.getQuarterForWeeks(weeks);
        const year = this.calendarService.getYearForWeeks(weeks);

        return <Calendar> {
            startWeekOnMonday: startWeekOnMonday,
            month: month,
            quarter: quarter,
            year: year,
            weeks: weeks,
            today: this.today
        };
    }
}