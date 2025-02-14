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

    public getQuarter(month: Period): Period {
        return this.dateRepositoryFactory.getRepository()
            .getQuarter(month);
    }

    private getWeeks(currentWeek: WeekModel, noWeeks: number, getWeek: (week: WeekModel) => WeekModel): WeekModel[] {
        let lastWeek = currentWeek;
        const weeks: WeekModel[] = [];

        for (let i = 0; i < noWeeks; i++) {
            lastWeek = getWeek(lastWeek);
            weeks.push(lastWeek);
        }

        return weeks;
    }
}