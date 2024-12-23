import {DateManager} from 'src/domain/managers/date.manager';
import {Month} from 'src/domain/models/month';
import {DateRepository} from 'src/domain/repositories/date.repository';
import {Year} from 'src/domain/models/year';
import {Day} from 'src/domain/models/day';

export class RepositoryDateManager implements DateManager {
    private readonly DECEMBER_INDEX = 11;
    private readonly JANUARY_INDEX = 0;

    private readonly today: Date;

    constructor(
        private readonly dateRepository: DateRepository
    ) {
        this.today = new Date();
    }

    public getCurrentDay(): Day {
        return this.dateRepository.getDay(this.today);
    }

    public async getCurrentYear(): Promise<Year> {
        const currentYear = this.today.getFullYear();

        return await this.dateRepository.getYear(currentYear);
    }

    public async getYear(month?: Month): Promise<Year> {
        if (!month) {
            const currentYear = this.today.getFullYear();
            return await this.dateRepository.getYear(currentYear);
        }

        return await this.dateRepository.getYear(month.date.getFullYear());
    }

    public async getCurrentMonth(): Promise<Month> {
        const currentMonthIndex = this.today.getMonth();
        const currentYear = this.today.getFullYear();

        return await this.dateRepository.getMonth(currentYear, currentMonthIndex);
    }

    public async getNextMonth(currentMonth?: Month): Promise<Month> {
        if (!currentMonth) {
            return await this.getCurrentMonth();
        }

        let currentYear = currentMonth.date.getFullYear();
        let currentMonthIndex = currentMonth.date.getMonth() + 1;

        if (currentMonthIndex > this.DECEMBER_INDEX) {
            currentYear += 1;
            currentMonthIndex = this.JANUARY_INDEX;
        }

        return await this.dateRepository.getMonth(currentYear, currentMonthIndex);
    }

    public async getPreviousMonth(currentMonth?: Month): Promise<Month> {
        if (!currentMonth) {
            return await this.getCurrentMonth();
        }

        let currentYear = currentMonth.date.getFullYear();
        let currentMonthIndex = currentMonth.date.getMonth() - 1;

        if (currentMonthIndex < this.JANUARY_INDEX) {
            currentYear -= 1;
            currentMonthIndex = this.DECEMBER_INDEX;
        }

        return await this.dateRepository.getMonth(currentYear, currentMonthIndex);
    }
}