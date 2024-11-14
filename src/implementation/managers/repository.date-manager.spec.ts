import {RepositoryDateManager} from 'src/implementation/managers/repository.date-manager';
import {DateRepository} from 'src/domain/repositories/date.repository';
import {Month} from 'src/domain/models/month';

describe('RepositoryDateManager', () => {
    let dateManager: RepositoryDateManager;
    let dateRepository: DateRepository;

    beforeEach(() => {
        dateRepository = {
            getYear: jest.fn(),
            getMonth: jest.fn()
        } as DateRepository;
        dateManager = new RepositoryDateManager(dateRepository);
    });

    it('should return the current year', () => {
        const today = new Date();
        const currentYear = {
            year: today.getFullYear(),
            months: []
        };

        (dateRepository.getYear as jest.Mock).mockReturnValue(currentYear);

        const result = dateManager.getCurrentYear();

        expect(result).toBe(currentYear);
        expect(dateRepository.getYear).toHaveBeenCalledWith(today.getFullYear());
    });

    it('should return the year of the provided month', () => {
        const month: Month = {
            year: 2023,
            monthIndex: 9,
            number: 10,
            name: 'October',
            weeks: []
        };
        const year = {
            year: 2023,
            months: []
        };

        (dateRepository.getYear as jest.Mock).mockReturnValue(year);

        const result = dateManager.getYear(month);

        expect(result).toBe(year);
        expect(dateRepository.getYear).toHaveBeenCalledWith(2023);
    });

    it('should return the current year if the month is not provided', () => {
        const today = new Date();
        const currentYear = {
            year: today.getFullYear(),
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
            year: today.getFullYear(),
            monthIndex: today.getMonth(),
            number: 10,
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
            year: 2023,
            monthIndex: 9, // October (0-based index)
            number: 10,
            name: 'October',
            weeks: []
        };
        const nextMonth: Month = {
            year: 2023,
            monthIndex: 10, // November (0-based index)
            number: 11,
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
            year: 2023,
            monthIndex: 9, // October (0-based index)
            number: 10,
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
            year: 2023,
            monthIndex: 9, // October (0-based index)
            number: 10,
            name: 'October',
            weeks: []
        };
        const previousMonth: Month = {
            year: 2023,
            monthIndex: 8, // September (0-based index)
            number: 9,
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
            year: 2023,
            monthIndex: 9, // October (0-based index)
            number: 10,
            name: 'October',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(currentMonth);

        const getCurrentMonthSpy = jest.spyOn(dateManager, 'getCurrentMonth');
        const result = dateManager.getPreviousMonth(undefined);

        expect(getCurrentMonthSpy).toHaveBeenCalled();
        expect(result).toBe(currentMonth);
    });

    it('should return the next month when current month is December', () => {
        const currentMonth: Month = {
            year: 2023,
            monthIndex: 11, // December (0-based index)
            number: 12,
            name: 'December',
            weeks: []
        };
        const nextMonth: Month = {
            year: 2024,
            monthIndex: 0, // January (0-based index)
            number: 1,
            name: 'January',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(nextMonth);

        const result = dateManager.getNextMonth(currentMonth);

        expect(result).toBe(nextMonth);
        expect(dateRepository.getMonth).toHaveBeenCalledWith(2024, 0);
    });

    it('should return the previous month when current month is January', () => {
        const currentMonth: Month = {
            year: 2023,
            monthIndex: 0, // January (0-based index)
            number: 1,
            name: 'January',
            weeks: []
        };
        const previousMonth: Month = {
            year: 2022,
            monthIndex: 11, // December (0-based index)
            number: 12,
            name: 'December',
            weeks: []
        };

        (dateRepository.getMonth as jest.Mock).mockReturnValueOnce(previousMonth);

        const result = dateManager.getPreviousMonth(currentMonth);

        expect(result).toBe(previousMonth);
        expect(dateRepository.getMonth).toHaveBeenCalledWith(2022, 11);
    });
});