import {DateManager} from 'src/domain/managers/date.manager';
import {Month} from 'src/domain/models/month';
import {DateRepository} from 'src/domain/repositories/date.repository';
import {Year} from 'src/domain/models/year';

export class RepositoryDateManager implements DateManager {
    private readonly DECEMBER_INDEX = 11;
    private readonly JANUARY_INDEX = 0;

    private readonly today: Date;

    constructor(
        private readonly dateRepository: DateRepository
    ) {
        this.today = new Date();
    }

    public getCurrentYear(): Year {
        const currentYear = this.today.getFullYear();

        return this.dateRepository.getYear(currentYear);
    }

    public getYear(month?: Month): Year {
        if (!month) {
            const currentYear = this.today.getFullYear();
            return this.dateRepository.getYear(currentYear);
        }

        return this.dateRepository.getYear(month.year);
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

        let currentYear = currentMonth.year;
        let currentMonthIndex = currentMonth.monthIndex + 1;

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

        let currentYear = currentMonth.year;
        let currentMonthIndex = currentMonth.monthIndex - 1;

        if (currentMonthIndex < this.JANUARY_INDEX) {
            currentYear--;
            currentMonthIndex = this.DECEMBER_INDEX;
        }

        return this.dateRepository.getMonth(currentYear, currentMonthIndex);
    }
}