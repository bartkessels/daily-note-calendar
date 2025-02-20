import {DateManager} from 'src/business/contracts/date.manager';
import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import {Period} from 'src/domain/models/period.model';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';

export class RepositoryDateManager implements DateManager {
    private readonly today: Date;

    constructor(
        private readonly dateRepositoryFactory: DateRepositoryFactory
    ) {
        this.today = new Date();
    }

    public getCurrentDay(): Period {
        return this.dateRepositoryFactory.getRepository()
            .getDayFromDate(this.today);
    }

    public getTomorrow(): Period {
        const tomorrow = this.today;
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.dateRepositoryFactory.getRepository()
            .getDayFromDate(tomorrow);
    }

    public getYesterday(): Period {
        const yesterday = this.today;
        yesterday.setDate(yesterday.getDate() - 1);

        return this.dateRepositoryFactory.getRepository()
            .getDayFromDate(yesterday);
    }

    public getCurrentWeek(startOfWeek: DayOfWeek): WeekModel {
        return this.dateRepositoryFactory.getRepository()
            .getWeekFromDate(startOfWeek, this.today);
    }

    public getWeek(period: Period, startOfWeek: DayOfWeek): WeekModel {
        return this.dateRepositoryFactory.getRepository()
            .getWeekFromDate(startOfWeek, period.date);
    }

    public getPreviousWeeks(startOfWeek: DayOfWeek, currentWeek: WeekModel, noWeeks: number): WeekModel[] {
        return this.getWeeks(currentWeek, noWeeks, (week) =>
            this.dateRepositoryFactory.getRepository().getPreviousWeek(startOfWeek, week)
        );
    }

    public getNextWeeks(startOfWeek: DayOfWeek, currentWeek: WeekModel, noWeeks: number): WeekModel[] {
        return this.getWeeks(currentWeek, noWeeks, (week) =>
            this.dateRepositoryFactory.getRepository().getNextWeek(startOfWeek, week)
        );
    }

    // TODO: Write unit tests for the month methods
    // TODO: Write unit tests for the sorting of the weeks for all methods
    public getPreviousMonth(month: Period, startOfWeek: DayOfWeek): WeekModel[] {
        const previousMonth = this.dateRepositoryFactory.getRepository().getPreviousMonth(month);
        return this.getWeeksForMonth(previousMonth, startOfWeek);
    }

    public getNextMonth(month: Period, startOfWeek: DayOfWeek): WeekModel[] {
        const nextMonth = this.dateRepositoryFactory.getRepository().getNextMonth(month);
        return this.getWeeksForMonth(nextMonth, startOfWeek);
    }

    public getQuarter(month: Period): Period {
        return this.dateRepositoryFactory.getRepository().getQuarter(month);
    }

    private getWeeksForMonth(month: Period, startOfWeek: DayOfWeek): WeekModel[] {
        const startOfMonth = new Date(month.date.getFullYear(), month.date.getMonth(), 1);
        const endOfMonth = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0);
        const middleOfMonth = new Date((startOfMonth.getTime() + endOfMonth.getTime()) / 2);

        const middleWeek = this.dateRepositoryFactory.getRepository().getWeekFromDate(startOfWeek, middleOfMonth);
        const previousWeeks = this.getPreviousWeeks(startOfWeek, middleWeek, 2);
        const nextWeeks = this.getNextWeeks(startOfWeek, middleWeek, 2);

        return this.sortWeeks([ ...previousWeeks, middleWeek, ...nextWeeks ]);
    }

    private getWeeks(currentWeek: WeekModel, noWeeks: number, getWeek: (week: WeekModel) => WeekModel): WeekModel[] {
        let lastWeek = currentWeek;
        const weeks: WeekModel[] = [];

        for (let i = 0; i < noWeeks; i++) {
            lastWeek = getWeek(lastWeek);
            weeks.push(lastWeek);
        }

        return this.sortWeeks(weeks);
    }

    private sortWeeks(weeks: WeekModel[]): WeekModel[] {
        return weeks.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
}