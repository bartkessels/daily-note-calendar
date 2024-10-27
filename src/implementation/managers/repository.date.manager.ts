import { DateManager } from "src/domain/managers/date.manager";
import { Month } from "src/domain/models/Month";
import { DateRepository } from "src/domain/repositories/date.repository";

export class RepositoryDateManager implements DateManager {
    private readonly DECEMBER_INDEX = 11;
    private readonly JANUARY_INDEX = 0;

    private readonly today: Date;

    constructor(
        private readonly dateRepository: DateRepository
    ) {
        this.today = new Date();
    }

    public getCurrentMonth(): Month {
        const currentMonth = this.today.getMonth();
        const currentYear = this.today.getFullYear();

        return this.dateRepository.getMonth(currentYear, currentMonth);
    }

    public getNextMonth(currentMonth?: Month): Month {
        if (!currentMonth) {
            return this.getCurrentMonth();
        }

        var currentYear = currentMonth.year;
        var currentMonthIndex = currentMonth.monthIndex + 1;

        if (currentMonthIndex > this.DECEMBER_INDEX) {
            currentYear++;
            currentMonthIndex = this.JANUARY_INDEX;
        }

        return this.dateRepository.getMonth(currentYear, currentMonthIndex);
    }

    public getPreviousMonth(currentMonth?: Month): Month {
        if (!currentMonth) {
            return this.getCurrentMonth();
        }
        console.log(currentMonth);

        var currentYear = currentMonth.year;
        var currentMonthIndex = currentMonth.monthIndex - 1;

        if (currentMonthIndex < this.JANUARY_INDEX) {
            currentYear--;
            currentMonthIndex = this.DECEMBER_INDEX;
        }

        return this.dateRepository.getMonth(currentYear, currentMonthIndex);
    }
}