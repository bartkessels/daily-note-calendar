import {RepositoryDateManager} from 'src/implementation/managers/repository.date-manager';
import {DateRepository} from 'src/domain/repositories/date.repository';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {Day, DayOfWeek} from 'src/domain/models/day';

describe('RepositoryDateManager', () => {
    let dateManager: RepositoryDateManager;
    let dateRepository: DateRepository;

    beforeEach(() => {
        dateRepository = {
            getDay: jest.fn(),
            getYear: jest.fn(),
            getMonth: jest.fn()
        } as DateRepository;
        dateManager = new RepositoryDateManager(dateRepository);
    });

    it('should return the current day', () => {
        const today = new Date(2024, 12, 31, 12, 11, 19, 100);
        const currentDay: Day = {
            date: today,
            dayOfWeek: DayOfWeek.Monday,
            name: today.getDate().toString()
        };

        (dateRepository.getDay as jest.Mock).mockReturnValue(currentDay);

        const result = dateManager.getCurrentDay();

        expect(result).toBe(currentDay);
        expect(dateRepository.getDay).toHaveBeenCalled();
    });


    it('should return the current year', () => {
        const today = new Date();
        const currentYear: Year = {
            date: today,
            name: today.getFullYear().toString(),
            months: []
        };

        (dateRepository.getYear as jest.Mock).mockReturnValue(currentYear);

        const result = dateManager.getCurrentYear();

        expect(result).toBe(currentYear);
        expect(dateRepository.getYear).toHaveBeenCalledWith(today.getFullYear());
    });

    it('should return the year of the provided month', () => {
        const month: Month = {
            date: new Date(2023, 9),
            quarter: 4,
            name: 'October',
            weeks: []
        };
        const year: Year = {
            date: new Date(2023, 0),
            name: '2023',
            months: []
        };

        (dateRepository.getYear as jest.Mock).mockReturnValue(year);

        const result = dateManager.getYear(month);

        expect(result).toBe(year);
        expect(dateRepository.getYear).toHaveBeenCalledWith(2023);
    });

    it('should return the current year if the month is not provided', () => {
        const today = new Date();
        const currentYear: Year = {
            date: today,
            name: today.getFullYear().toString(),
            months: []
        };

        (dateRepository.getYear as jest.Mock).mockReturnValue(currentYear);

        const result = dateManager.getYear(undefined);

        expect(result).toBe(currentYear);
        expect(dateRepository.getYear).toHaveBeenCalledWith(today.getFullYear());
    });

    it('should return the current month', () => {
        const today = new Date();
        const currentMonth: Month = {
            date: today,
            quarter: Math.floor(today.getMonth() / 3) + 1,
            name: 'October',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValue(currentMonth);

        const result = dateManager.getCurrentMonth();

        expect(result).toBe(currentMonth);
        expect(dateRepository.getMonth).toHaveBeenCalledWith(today.getFullYear(), today.getMonth());
    });

    it('should return the next month', () => {
        const currentMonth: Month = {
            date: new Date(2023, 9),
            quarter: 4,
            name: 'October',
            weeks: []
        };
        const nextMonth: Month = {
            date: new Date(2023, 10),
            quarter: 4,
            name: 'November',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(nextMonth);

        const result = dateManager.getNextMonth(currentMonth);

        expect(result).toBe(nextMonth);
        expect(dateRepository.getMonth).toHaveBeenCalledWith(2023, 10);
    });

    it('should recalculate the current month and return it if no current month is provided when retrieving the next month', () => {
        const currentMonth: Month = {
            date: new Date(2023, 9),
            quarter: 4,
            name: 'October',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(currentMonth);

        const getCurrentMonthSpy = jest.spyOn(dateManager, 'getCurrentMonth');
        const result = dateManager.getNextMonth(undefined);

        expect(getCurrentMonthSpy).toHaveBeenCalled();
        expect(result).toBe(currentMonth);
    });

    it('should return the previous month', () => {
        const currentMonth: Month = {
            date: new Date(2023, 9),
            quarter: 4,
            name: 'October',
            weeks: []
        };
        const previousMonth: Month = {
            date: new Date(2023, 8),
            quarter: 4,
            name: 'September',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(previousMonth);

        const result = dateManager.getPreviousMonth(currentMonth);

        expect(result).toBe(previousMonth);
        expect(dateRepository.getMonth).toHaveBeenCalledWith(2023, 8);
    });

    it('should recalculate the current month and return it if no current month is provided when retrieving the previous month', () => {
        const currentMonth: Month = {
            date: new Date(2023, 9),
            quarter: 4,
            name: 'October',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(currentMonth);

        const getCurrentMonthSpy = jest.spyOn(dateManager, 'getCurrentMonth');
        const result = dateManager.getPreviousMonth(undefined);

        expect(getCurrentMonthSpy).toHaveBeenCalled();
        expect(result).toBe(currentMonth);
    });

    it('should return January as the next month when current month is December', () => {
        const currentMonth: Month = {
            date: new Date(2023, 11),
            quarter: 4,
            name: 'December',
            weeks: []
        };
        const nextMonth: Month = {
            date: new Date(2024, 0),
            quarter: 1,
            name: 'January',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(nextMonth);

        const result = dateManager.getNextMonth(currentMonth);

        expect(result).toBe(nextMonth);
        expect(dateRepository.getMonth).toHaveBeenCalledWith(2024, 0);
    });

    it('should return December as the previous month when current month is January', () => {
        const currentMonth: Month = {
            date: new Date(2023, 0),
            quarter: 1,
            name: 'January',
            weeks: []
        };
        const previousMonth: Month = {
            date: new Date(2022, 11),
            quarter: 4,
            name: 'December',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(previousMonth);

        const result = dateManager.getPreviousMonth(currentMonth);

        expect(result).toBe(previousMonth);
        expect(dateRepository.getMonth).toHaveBeenCalledWith(2022, 11);
    });
});