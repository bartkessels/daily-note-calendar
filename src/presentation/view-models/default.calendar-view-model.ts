import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {DayOfWeek, Week} from 'src/domain/models/week';
import {Calendar} from 'src/domain/models/calendar.model';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';

export class DefaultCalendarViewModel implements CalendarViewModel {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private today: Period | null = null;

    public setSelectedPeriod?: (period: Period) => void;
    public navigateToNextWeek?: () => void;
    public navigateToPreviousWeek?: () => void;
    public navigateToCurrentWeek?: () => void;
    public navigateToNextMonth?: () => void;
    public navigateToPreviousMonth?: () => void;

    constructor(
        private readonly calendarService: CalendarService
    ) {

    }

    public initialize(settings: PluginSettings, today: Period): void {
        this.settings = settings;
        this.today = today;

        this.calendarService.initialize(settings);
    }

    public initializeCallbacks(
        setSelectedPeriod: (period: Period) => void,
        navigateToNextWeek: () => void,
        navigateToPreviousWeek: () => void,
        navigateToCurrentWeek: () => void,
        navigateToNextMonth: () => void,
        navigateToPreviousMonth: () => void
    ): void {
        this.setSelectedPeriod = setSelectedPeriod;
        this.navigateToNextWeek = navigateToNextWeek;
        this.navigateToPreviousWeek = navigateToPreviousWeek;
        this.navigateToCurrentWeek = navigateToCurrentWeek;
        this.navigateToNextMonth = navigateToNextMonth;
        this.navigateToPreviousMonth = navigateToPreviousMonth;
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
        const weekDays = this.buildWeekDays(this.settings.generalSettings.firstDayOfWeek);
        const month = this.calendarService.getMonthForWeeks(weeks);
        const quarter = this.calendarService.getQuarterForWeeks(weeks);
        const year = this.calendarService.getYearForWeeks(weeks);

        return <Calendar> {
            startWeekOnMonday: startWeekOnMonday,
            weekDays: weekDays,
            month: month,
            quarter: quarter,
            year: year,
            weeks: weeks,
            today: this.today
        };
    }

    private buildWeekDays(firstDayOfWeek: DayOfWeek): string[] {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const startIndex = (firstDayOfWeek - 1 + 7) % 7;
        return [...days.slice(startIndex), ...days.slice(0, startIndex)];
    }
}