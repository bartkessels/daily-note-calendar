import {DateManager} from 'src/business/contracts/date.manager';
import {DayOfWeek, WeekModel, WeekNumberStandard} from 'src/domain/models/week.model';
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

    public getCurrentWeek(startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel {
        return this.dateRepositoryFactory.getRepository()
            .getWeekFromDate(startOfWeek, standard, this.today);
    }

    public getWeek(period: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel {
        return this.dateRepositoryFactory.getRepository()
            .getWeekFromDate(startOfWeek, standard, period.date);
    }

    public getPreviousWeeks(currentWeek: WeekModel, startOfWeek: DayOfWeek, standard: WeekNumberStandard, noWeeks: number): WeekModel[] {
        return this.getWeeks(currentWeek, noWeeks, (week) =>
            this.dateRepositoryFactory.getRepository().getPreviousWeek(startOfWeek, standard, week)
        );
    }

    public getNextWeeks(currentWeek: WeekModel, startOfWeek: DayOfWeek, standard: WeekNumberStandard, noWeeks: number): WeekModel[] {
        return this.getWeeks(currentWeek, noWeeks, (week) =>
            this.dateRepositoryFactory.getRepository().getNextWeek(startOfWeek, standard, week)
        );
    }

    public getPreviousMonth(month: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel[] {
        const previousMonth = this.dateRepositoryFactory.getRepository().getPreviousMonth(month);
        return this.getWeeksForMonth(previousMonth, startOfWeek, standard);
    }

    public getNextMonth(month: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel[] {
        const nextMonth = this.dateRepositoryFactory.getRepository().getNextMonth(month);
        return this.getWeeksForMonth(nextMonth, startOfWeek, standard);
    }

    public getQuarter(month: Period): Period {
        return this.dateRepositoryFactory.getRepository().getQuarter(month);
    }

    private getWeeksForMonth(month: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel[] {
        const startOfMonth = new Date(month.date.getFullYear(), month.date.getMonth(), 1);
        const endOfMonth = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0);
        const middleOfMonth = new Date((startOfMonth.getTime() + endOfMonth.getTime()) / 2);

        const middleWeek = this.dateRepositoryFactory.getRepository().getWeekFromDate(startOfWeek, standard, middleOfMonth);
        const previousWeeks = this.getPreviousWeeks(middleWeek, startOfWeek, standard, 2);
        const nextWeeks = this.getNextWeeks(middleWeek, startOfWeek, standard, 2);

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