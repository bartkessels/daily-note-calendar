import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {DateManager} from 'src/business/contracts/date.manager';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {Week} from 'src/domain/models/week';
import {Period} from 'src/domain/models/period.model';

export class DefaultCalendarService implements CalendarService {
    private static readonly PREVIOUS_WEEKS_COUNT = 2;
    private static readonly NEXT_WEEKS_COUNT = 3;
    private static readonly REFERENCE_WEEK_INDEX = 2;

    private readonly dateManager: DateManager;
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private selectedPeriod: Period | null = null;

    constructor(
        private readonly dateManagerFactory: DateManagerFactory
    ) {
        this.dateManager = this.dateManagerFactory.getManager();
    }

    public initialize(settings: PluginSettings): void {
        this.settings = settings;
    }

    public getCurrentWeek(): Week[] {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;
        const currentWeek = this.dateManager.getCurrentWeek(firstDayOfWeek, weekNumberStandard);

        return this.loadWeeks(currentWeek, DefaultCalendarService.PREVIOUS_WEEKS_COUNT, DefaultCalendarService.NEXT_WEEKS_COUNT);
    }

    public getWeekForPeriod(period: Period): Week[] {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;

        // Use middle day of week for navigation if period is a Week
        const periodToUse = this.isWeek(period) ? this.getMiddleDay(period as Week) : period;
        const week = this.dateManager.getWeek(periodToUse, firstDayOfWeek, weekNumberStandard);

        this.selectedPeriod = periodToUse;
        return this.loadWeeks(week, DefaultCalendarService.PREVIOUS_WEEKS_COUNT, DefaultCalendarService.NEXT_WEEKS_COUNT);
    }

    public getPreviousWeek(weeks: Week[]): Week[] {
        this.selectedPeriod = null;
        const newReferenceWeek = weeks[1]; // Week before current reference (index 2)
        return this.loadWeeks(newReferenceWeek, DefaultCalendarService.PREVIOUS_WEEKS_COUNT, DefaultCalendarService.NEXT_WEEKS_COUNT);
    }

    public getNextWeek(weeks: Week[]): Week[] {
        this.selectedPeriod = null;
        const newReferenceWeek = weeks[3]; // Week after current reference (index 2)
        return this.loadWeeks(newReferenceWeek, DefaultCalendarService.PREVIOUS_WEEKS_COUNT, DefaultCalendarService.NEXT_WEEKS_COUNT);
    }

    public getPreviousMonth(weeks: Week[]): Week[] {
        this.selectedPeriod = null;
        const referenceWeek = this.getReferenceWeek(weeks);
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;
        const previousMonth = this.dateManager.getPreviousMonth(referenceWeek, firstDayOfWeek, weekNumberStandard);

        return this.sortWeeks(previousMonth);
    }

    public getNextMonth(weeks: Week[]): Week[] {
        this.selectedPeriod = null;
        const referenceWeek = this.getReferenceWeek(weeks);
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;
        const nextMonth = this.dateManager.getNextMonth(referenceWeek, firstDayOfWeek, weekNumberStandard);

        return this.sortWeeks(nextMonth);
    }

    private getReferenceWeek(weeks: Week[]): Week {
        return weeks[DefaultCalendarService.REFERENCE_WEEK_INDEX]; // Reference week is always at index 2 (2 before, reference, 3 after)
    }

    public getMonthForWeeks(weeks: Week[], selectedPeriod?: Period): Period {
        const dayToUse = selectedPeriod || this.selectedPeriod;
        if (dayToUse) {
            return this.dateManager.getMonth(dayToUse);
        }
        // Use reference week (index 2) when no selected period
        const referenceWeek = this.getReferenceWeek(weeks);
        const referenceDay = this.getMiddleDay(referenceWeek);
        return this.dateManager.getMonth(referenceDay);
    }

    public getQuarterForWeeks(weeks: Week[], selectedPeriod?: Period): Period {
        const dayToUse = selectedPeriod || this.selectedPeriod;
        if (dayToUse) {
            const month = this.dateManager.getMonth(dayToUse);
            return this.dateManager.getQuarter(month);
        }
        // Use reference week (index 2) when no selected period
        const referenceWeek = this.getReferenceWeek(weeks);
        const referenceDay = this.getMiddleDay(referenceWeek);
        const month = this.dateManager.getMonth(referenceDay);
        return this.dateManager.getQuarter(month);
    }

    public getYearForWeeks(weeks: Week[], selectedPeriod?: Period): Period {
        const dayToUse = selectedPeriod || this.selectedPeriod;
        if (dayToUse) {
            return this.dateManager.getYear(dayToUse);
        }
        // Use reference week (index 2) when no selected period
        const referenceWeek = this.getReferenceWeek(weeks);
        const referenceDay = this.getMiddleDay(referenceWeek);
        return this.dateManager.getYear(referenceDay);
    }

    private isWeek(period: Period): period is Week {
        return 'days' in period && Array.isArray((period as Week).days);
    }

    private getMiddleDay(week: Week): Period {
        return week.days[Math.floor(week.days.length / 2)];
    }

    private loadWeeks(currentWeek: Week, noPreviousWeeks: number, noNextWeeks: number): Week[] {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;

        const previousWeeks = this.dateManager.getPreviousWeeks(currentWeek, firstDayOfWeek, weekNumberStandard, noPreviousWeeks);
        const nextWeeks = this.dateManager.getNextWeeks(currentWeek, firstDayOfWeek, weekNumberStandard, noNextWeeks);
        const weeks = [...previousWeeks, currentWeek, ...nextWeeks];

        return this.sortWeeks(weeks);
    }

    private sortWeeks(weeks: Week[]): Week[] {
        return weeks.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
}
