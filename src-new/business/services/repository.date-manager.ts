import {DateManager} from 'src-new/business/contracts/date.manager';
import {WeekModel} from 'src-new/domain/models/week.model';
import {DateService} from 'src-new/infrastructure/contracts/date-service';

export class RepositoryDateManager implements DateManager {
    private readonly today: Date;

    constructor(
        private readonly dateService: DateService
    ) {
        this.today = new Date();
    }

    public getCurrentWeek(): WeekModel {
        return this.dateService.getWeekFromDate(this.today);
    }

    public getPreviousWeeks(currentWeek: WeekModel, noWeeks: number): WeekModel[] {
        if (noWeeks <= 0) {
            return [];
        }

        const previousWeeks: WeekModel[] = [currentWeek];
        for (let i = 0; i < noWeeks; i++) {
            previousWeeks.push(this.dateService.getPreviousWeek(previousWeeks.last()));
        }

        return previousWeeks.sort((a, b) => a.date - b.date);
    }

    public getNextWeeks(currentWeek: WeekModel, noWeeks: number): WeekModel[] {
        if (noWeeks <= 0) {
            return [];
        }

        const nextWeeks: WeekModel[] = [currentWeek];
        for (let i = 0; i < noWeeks; i++) {
            nextWeeks.push(this.dateService.getNextWeek(nextWeeks.last()));
        }

        return nextWeeks.sort((a, b) => a.date - b.date);
    }

}