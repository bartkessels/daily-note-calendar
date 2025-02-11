import {DateManager} from 'src/business/contracts/date.manager';
import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';
import {Period} from 'src/domain/models/period.model';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';

export class RepositoryDateManager implements DateManager {
    private readonly dateRepository: DateRepository;
    private readonly today: Date;

    constructor(dateRepositoryFactory: DateRepositoryFactory) {
        this.dateRepository = dateRepositoryFactory.getRepository();
        this.today = new Date();
    }

    public getCurrentDay(): Period {
        return this.dateRepository.getDayFromDate(this.today);
    }

    public getCurrentWeek(startOfWeek: DayOfWeek): WeekModel {
        return this.dateRepository.getWeekFromDate(startOfWeek, this.today);
    }

    public getWeek(period: Period, startOfWeek: DayOfWeek): WeekModel {
        return this.dateRepository.getWeekFromDate(startOfWeek, period.date);
    }

    public getPreviousWeeks(startOfWeek: DayOfWeek, currentWeek: WeekModel, noWeeks: number): WeekModel[] {
        return this.getWeeks(currentWeek, noWeeks, (week) => this.dateRepository.getPreviousWeek(startOfWeek, week));
    }

    public getNextWeeks(startOfWeek: DayOfWeek, currentWeek: WeekModel, noWeeks: number): WeekModel[] {
        return this.getWeeks(currentWeek, noWeeks, (week) => this.dateRepository.getNextWeek(startOfWeek, week));
    }

    public getQuarter(month: Period): Period {
        return this.dateRepository.getQuarter(month);
    }

    private getWeeks(currentWeek: WeekModel, noWeeks: number, getWeek: (week: WeekModel) => WeekModel): WeekModel[] {
        let lastWeek = currentWeek;
        const weeks: WeekModel[] = [];

        for (let i = 0; i < noWeeks; i++) {
            lastWeek = getWeek(lastWeek);
            weeks.push(lastWeek);
        }

        return weeks.sort((a, b) => a.date.getDate() - b.date.getDate());
    }
}