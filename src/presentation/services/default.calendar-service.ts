import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {DateManager} from 'src/business/contracts/date.manager';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {Week} from 'src/domain/models/week';
import {Period} from 'src/domain/models/period.model';

export class DefaultCalendarService implements CalendarService {
    private readonly dateManager: DateManager;
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;

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

        return this.loadWeeks(currentWeek, 2, 3);
    }

    public getPreviousWeek(weeks: Week[]): Week[] {
        const middleWeek = this.getMiddleWeek(weeks);
        return this.loadWeeks(middleWeek, 4, 1);
    }

    public getNextWeek(weeks: Week[]): Week[] {
        const middleWeek = this.getMiddleWeek(weeks);
        return this.loadWeeks(middleWeek, 2, 3);
    }

    public getPreviousMonth(weeks: Week[]): Week[] {
        const middleWeek = this.getMiddleWeek(weeks);
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;
        const previousMonth = this.dateManager.getPreviousMonth(middleWeek, firstDayOfWeek, weekNumberStandard);

        return this.sortWeeks(previousMonth);
    }

    public getNextMonth(weeks: Week[]): Week[] {
        const middleWeek = this.getMiddleWeek(weeks);
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;
        const nextMonth = this.dateManager.getNextMonth(middleWeek, firstDayOfWeek, weekNumberStandard);

        return this.sortWeeks(nextMonth);
    }

    public getMonthForWeeks(weeks: Week[]): Period {
        const middleWeek = this.getMiddleWeek(weeks);
        return middleWeek.month;
    }

    public getQuarterForWeeks(weeks: Week[]): Period {
        const middleWeek = this.getMiddleWeek(weeks);
        return middleWeek.quarter;
    }

    public getYearForWeeks(weeks: Week[]): Period {
        const middleWeek = this.getMiddleWeek(weeks);
        return middleWeek.year;
    }

    private getMiddleWeek(weeks: Week[]): Week {
        return weeks[Math.floor(weeks.length / 2)];
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