import { DateFnsDateRepository } from 'src/implementation/repositories/date-fns.date.repository';
import { DayOfWeek } from 'src/domain/models/day';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/models/settings/general.settings';

describe('DateFnsDateRepository', () => {
    let repository: DateFnsDateRepository;
    let settingsRepository: jest.Mocked<SettingsRepository<GeneralSettings>>;

    beforeEach(() => {
        settingsRepository = {
            storeSettings: jest.fn(),
            getSettings: jest.fn()
        } as jest.Mocked<SettingsRepository<GeneralSettings>>;

        repository = new DateFnsDateRepository(settingsRepository);
        settingsRepository.getSettings.mockResolvedValue(DEFAULT_GENERAL_SETTINGS);
    });

    it('should return the correct day', () => {
        const date = new Date(2023, 9, 1);
        const day = repository.getDay(date);

        expect(day.name).toBe('1');
        expect(day.dayOfWeek).toBe(DayOfWeek.Sunday);
        expect(day.date).toEqual(date);
    });

    it('should return the correct year information', async () => {
        const year = 2023;
        const result = await repository.getYear(year);

        expect(result.date.getFullYear()).toBe(year);
        expect(result.name).toBe('2023');
    });

    it('should return the correct month information', async () => {
        const year = 2023;
        const monthIndex = 9;

        const month = await repository.getMonth(year, monthIndex);

        expect(month.name).toBe('October');
        expect(month.weeks.length).toBeGreaterThan(0);
        expect(month.date.getMonth()).toBe(monthIndex);
        expect(month.date.getFullYear()).toBe(year);
        expect(month.quarter.quarter).toBe(4);
        expect(month.quarter.year).toBe(year);
    });

    it('should return the correct week number', async () => {
        const year = 2023;
        const month = 9;

        const weekNumber = (await repository.getMonth(year, month)).weeks[0].weekNumber;

        expect(weekNumber).toBe('39');
    });

    it('should return week number 1 for the last week of December 2024', async () => {
        const year = 2024;
        const month = 11;

        const weeks = (await repository.getMonth(year, month)).weeks;
        const lastWeek = weeks[weeks.length - 1];

        expect(lastWeek.weekNumber).toBe('01');
    });

    it('should return week number 1 for the first week of January 2025', async () => {
        const year = 2025;
        const month = 0;

        const weeks = (await repository.getMonth(year, month)).weeks;
        const firstWeek = weeks[0];

        expect(firstWeek.weekNumber).toBe('01');
    });

    it('should return the number of the week with 0s padded', async () => {
        const year = 2024;
        const month = 0;

        const week = (await repository.getMonth(year, month)).weeks[0];

        expect(week.weekNumber).toBe('01');
    });

    it('should return the correct day of the week', async () => {
        const year = 2023;
        const month = 9;

        const dayOfWeek = (await repository.getMonth(year, month)).weeks[0].days[0].dayOfWeek;

        expect(dayOfWeek).toBe(DayOfWeek.Sunday);
    });

    it('should return the correct quarter for each month', async () => {
        const year = 2023;
        const months = [];

        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            months.push(await repository.getMonth(year, monthIndex));
        }

        // First quarter
        for (let index = 0; index <= 2; index++) {
            expect(months[index].quarter.date.getFullYear()).toBe(year);
            expect(months[index].quarter.date.getMonth()).toBe(index);
            expect(months[index].quarter.year).toBe(year);
            expect(months[index].quarter.quarter).toBe(1);
        }

        // Second quarter
        for (let index = 3; index <= 5; index++) {
            expect(months[index].quarter.date.getFullYear()).toBe(year);
            expect(months[index].quarter.date.getMonth()).toBe(index);
            expect(months[index].quarter.year).toBe(year);
            expect(months[index].quarter.quarter).toBe(2);
        }

        // Third quarter
        for (let index = 6; index <= 8; index++) {
            expect(months[index].quarter.date.getFullYear()).toBe(year);
            expect(months[index].quarter.date.getMonth()).toBe(index);
            expect(months[index].quarter.year).toBe(year);
            expect(months[index].quarter.quarter).toBe(3);
        }

        // Fourth quarter
        for (let index = 9; index <= 11; index++) {
            expect(months[index].quarter.date.getFullYear()).toBe(year);
            expect(months[index].quarter.date.getMonth()).toBe(index);
            expect(months[index].quarter.year).toBe(year);
            expect(months[index].quarter.quarter).toBe(4);
        }
    });

    it('should get days of the week starting with Sunday', async () => {
        const settings = { firstDayOfWeek: DayOfWeek.Sunday } as GeneralSettings;
        settingsRepository.getSettings.mockResolvedValue(settings);

        const month = await repository.getMonth(2023, 9);

        month.weeks.forEach(week => {
            if (week.days.length >= 7) {
                // We only need to validate the weeks that have all 7 days
                expect(week.days[0].dayOfWeek).toBe(DayOfWeek.Sunday);
            }
        });
    });

    it('should get days of the week starting with Monday', async () => {
        settingsRepository.getSettings.mockResolvedValue({...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Monday});

        const month = await repository.getMonth(2023, 9);

        month.weeks.forEach(week => {
            if (week.days.length >= 7) {
                // We only need to validate the weeks that have all 7 days
                expect(week.days[0].dayOfWeek).toBe(DayOfWeek.Monday);
            }
        });
    });
});