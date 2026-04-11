import {mockDateManager} from 'src/test-helpers/manager.mocks';
import {DefaultCalendarService} from 'src/presentation/services/default.calendar-service';
import {mockDateManagerFactory} from 'src/test-helpers/factory.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/settings/general.settings';
import {DayOfWeek, Week, WeekNumberStandard} from 'src/domain/models/week';
import {Period, PeriodType} from 'src/domain/models/period.model';

describe('DefaultCalendarService', () => {
    const dateManager = mockDateManager;
    const expectedMonth = <Period> {
        date: new Date(2023, 9),
        name: 'October',
        type: PeriodType.Month,
    };
    const expectedQuarter = <Period> {
        date: new Date(2023, 6),
        name: 'Q3',
        type: PeriodType.Quarter,
    };
    const expectedYear = <Period> {
        date: new Date(2023, 0),
        name: '2023',
        type: PeriodType.Year,
    };

    let service: DefaultCalendarService;

    beforeEach(() => {
        const dateManagerFactory = mockDateManagerFactory(dateManager);

        service = new DefaultCalendarService(dateManagerFactory);

        when(dateManager.getPreviousWeeks).mockReturnValue([]);
        when(dateManager.getNextWeeks).mockReturnValue([]);
        when(dateManager.getPreviousMonth).mockReturnValue([]);
        when(dateManager.getNextMonth).mockReturnValue([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCurrentWeek', () => {
        const currentWeek = <Week> {
            date: new Date(2023, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: expectedYear,
            quarter: expectedQuarter,
            month: expectedMonth,
            days: [],
        };

        it('should use the default settings for the firstDayOfWeek and weekNumberStandard if the initialize method has not been called', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            service.getCurrentWeek();

            // Assert
            expect(dateManager.getCurrentWeek).toHaveBeenCalledWith(settings.generalSettings.firstDayOfWeek, settings.generalSettings.weekNumberStandard);
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US,
                },
            };

            // Act
            service.initialize(settings);
            service.getCurrentWeek();

            // Assert
            expect(dateManager.getCurrentWeek).toHaveBeenCalledWith(settings.generalSettings.firstDayOfWeek, settings.generalSettings.weekNumberStandard);
        });
        
        it('should get the previous two weeks from the date manager', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            when(dateManager.getCurrentWeek).mockReturnValue(currentWeek);

            // Act
            service.getCurrentWeek();

            // Assert
            expect(dateManager.getPreviousWeeks).toHaveBeenCalledWith(
                currentWeek,
                settings.generalSettings.firstDayOfWeek,
                settings.generalSettings.weekNumberStandard,
                2,
            );
        });
        
        it('should get the next to weeks from the date manager', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            when(dateManager.getCurrentWeek).mockReturnValue(currentWeek);

            // Act
            service.getCurrentWeek();

            // Assert
            expect(dateManager.getNextWeeks).toHaveBeenCalledWith(
                currentWeek,
                settings.generalSettings.firstDayOfWeek,
                settings.generalSettings.weekNumberStandard,
                3,
            );
        });
        
        it('should return the weeks sorted based on the week number', async () => {
            // Arrange
            const firstWeek = <Week> {
                date: new Date(2023, 9, 2),
                name: '42',
                type: PeriodType.Week,
                weekNumber: 42,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };

            when(dateManager.getCurrentWeek).mockReturnValue(lastWeek);
            when(dateManager.getPreviousWeeks).mockReturnValue([currentWeek]);
            when(dateManager.getNextWeeks).mockReturnValue([firstWeek]);

            // Act
            const result = service.getCurrentWeek();

            // Assert
            expect(result).toEqual([firstWeek, currentWeek, lastWeek]);
        });
    });

    describe('getPreviousWeek', () => {
        const currentWeeks = [<Week>{
            date: new Date(2023, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: expectedYear,
            quarter: expectedQuarter,
            month: expectedMonth,
            days: [],
        }];

        it('should use the default settings for the firstDayOfWeek and weekNumberStandard if the initialize method has not been called', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            service.getPreviousWeek(currentWeeks);

            // Assert
            expect(dateManager.getPreviousWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    4,
                );
            expect(dateManager.getNextWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    1,
                );
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US,
                },
            };

            // Act
            service.initialize(settings);
            service.getPreviousWeek(currentWeeks);

            // Assert
            expect(dateManager.getPreviousWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    4,
                );
            expect(dateManager.getNextWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    1,
                );
        });

        it('should return the weeks sorted based on the week number', async () => {
            // Arrange
            const firstWeek = <Week> {
                date: new Date(2023, 9, 2),
                name: '42',
                type: PeriodType.Week,
                weekNumber: 42,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };

            when(dateManager.getPreviousWeeks).mockReturnValue([lastWeek]);
            when(dateManager.getNextWeeks).mockReturnValue([firstWeek]);

            // Act
            const result = service.getPreviousWeek([currentWeek]);

            // Assert
            expect(result).toEqual([firstWeek, currentWeek, lastWeek]);
        });
    });

    describe('getNextWeek', () => {
        const currentWeeks = [<Week>{
            date: new Date(2023, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: expectedYear,
            quarter: expectedQuarter,
            month: expectedMonth,
            days: [],
        }];

        it('should use the default settings for the firstDayOfWeek and weekNumberStandard if the initialize method has not been called', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            service.getNextWeek(currentWeeks);

            // Assert
            expect(dateManager.getPreviousWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    2,
                );
            expect(dateManager.getNextWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    3,
                );
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US,
                },
            };

            // Act
            service.initialize(settings);
            service.getNextWeek(currentWeeks);

            // Assert
            expect(dateManager.getPreviousWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    2,
                );
            expect(dateManager.getNextWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    3,
                );
        });

        it('should return the weeks sorted based on the week number', async () => {
            // Arrange
            const firstWeek = <Week> {
                date: new Date(2023, 9, 2),
                name: '42',
                type: PeriodType.Week,
                weekNumber: 42,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };

            when(dateManager.getPreviousWeeks).mockReturnValue([lastWeek]);
            when(dateManager.getNextWeeks).mockReturnValue([firstWeek]);

            // Act
            const result = service.getNextWeek([currentWeek]);

            // Assert
            expect(result).toEqual([firstWeek, currentWeek, lastWeek]);
        });
    });

    describe('getPreviousMonth', () => {
        const currentWeeks = [<Week>{
            date: new Date(2023, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: expectedYear,
            quarter: expectedQuarter,
            month: expectedMonth,
            days: [],
        }];

        it('should use the default settings for the firstDayOfWeek and weekNumberStandard if the initialize method has not been called', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            service.getPreviousMonth(currentWeeks);

            // Assert
            expect(dateManager.getPreviousMonth)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                );
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US,
                },
            };

            // Act
            service.initialize(settings);
            service.getPreviousMonth(currentWeeks);

            // Assert
            expect(dateManager.getPreviousMonth)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                );
        });

        it('should return the weeks sorted based on the week number', async () => {
            // Arrange
            const firstWeek = <Week> {
                date: new Date(2023, 9, 2),
                name: '42',
                type: PeriodType.Week,
                weekNumber: 42,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };

            when(dateManager.getPreviousMonth).mockReturnValue([lastWeek, firstWeek, currentWeek]);

            // Act
            const result = service.getPreviousMonth([currentWeek]);

            // Assert
            expect(result).toEqual([firstWeek, currentWeek, lastWeek]);
        });
    });

    describe('getNextMonth', () => {
        const currentWeeks = [<Week>{
            date: new Date(2023, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: expectedYear,
            quarter: expectedQuarter,
            month: expectedMonth,
            days: [],
        }];

        it('should use the default settings for the firstDayOfWeek and weekNumberStandard if the initialize method has not been called', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            service.getNextMonth(currentWeeks);

            // Assert
            expect(dateManager.getNextMonth)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                );
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US,
                },
            };

            // Act
            service.initialize(settings);
            service.getNextMonth(currentWeeks);

            // Assert
            expect(dateManager.getNextMonth)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                );
        });

        it('should return the weeks sorted based on the week number', async () => {
            // Arrange
            const firstWeek = <Week> {
                date: new Date(2023, 9, 2),
                name: '42',
                type: PeriodType.Week,
                weekNumber: 42,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: [],
            };

            when(dateManager.getNextMonth).mockReturnValue([lastWeek, firstWeek, currentWeek]);

            // Act
            const result = service.getNextMonth([currentWeek]);

            // Assert
            expect(result).toEqual([firstWeek, currentWeek, lastWeek]);
        });
    });

    describe('getMonthForWeeks', () => {
        const octoberMonth = <Period> {
            date: new Date(2026, 9),
            name: 'October',
            type: PeriodType.Month,
        };
        const novemberMonth = <Period> {
            date: new Date(2026, 10),
            name: 'November',
            type: PeriodType.Month,
        };

        it('should return month with most days when counts differ', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 9, 26),
                    name: '44',
                    type: PeriodType.Week,
                    weekNumber: 44,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: octoberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 26), name: '26', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 27), name: '27', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 1), name: '1', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 10, 2),
                    name: '45',
                    type: PeriodType.Week,
                    weekNumber: 45,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: novemberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 10, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 3), name: '3', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 4), name: '4', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getMonthForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(novemberMonth);
        });

        it('should prefer earlier month when day counts are equal', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 9, 26),
                    name: '44',
                    type: PeriodType.Week,
                    weekNumber: 44,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: octoberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 30), name: '30', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 10, 2),
                    name: '45',
                    type: PeriodType.Week,
                    weekNumber: 45,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: novemberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 10, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 3), name: '3', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 4), name: '4', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getMonthForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(novemberMonth);
        });

        it('should handle 2-week end-of-month scenario correctly (issue #151)', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 9, 26),
                    name: '44',
                    type: PeriodType.Week,
                    weekNumber: 44,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: octoberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 26), name: '26', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 27), name: '27', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 31), name: '31', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 1), name: '1', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 10, 2),
                    name: '45',
                    type: PeriodType.Week,
                    weekNumber: 45,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: novemberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 10, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 3), name: '3', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 4), name: '4', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 7), name: '7', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 8), name: '8', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getMonthForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(novemberMonth);
        });

        it('should handle single week correctly', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 9, 26),
                    name: '44',
                    type: PeriodType.Week,
                    weekNumber: 44,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: octoberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 26), name: '26', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 27), name: '27', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getMonthForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(octoberMonth);
        });

        it('should return todays month when today is visible in the weeks', () => {
            // Arrange
            const today = <Period>{ date: new Date(2026, 9, 29), name: '29', type: PeriodType.Day };
            const weeks = [
                <Week> {
                    date: new Date(2026, 9, 26),
                    name: '44',
                    type: PeriodType.Week,
                    weekNumber: 44,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: octoberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 26), name: '26', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 27), name: '27', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 31), name: '31', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 1), name: '1', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 10, 2),
                    name: '45',
                    type: PeriodType.Week,
                    weekNumber: 45,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: novemberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 10, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 3), name: '3', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 4), name: '4', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 7), name: '7', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 8), name: '8', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getMonthForWeeks(weeks, today);

            // Assert
            expect(result).toEqual(octoberMonth);
        });

        it('should fall back to day-counting when today is not visible', () => {
            // Arrange
            const today = <Period>{ date: new Date(2026, 11, 15), name: '15', type: PeriodType.Day };
            const weeks = [
                <Week> {
                    date: new Date(2026, 9, 26),
                    name: '44',
                    type: PeriodType.Week,
                    weekNumber: 44,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: octoberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 26), name: '26', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 27), name: '27', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 31), name: '31', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 1), name: '1', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 10, 2),
                    name: '45',
                    type: PeriodType.Week,
                    weekNumber: 45,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: novemberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 10, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 3), name: '3', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 4), name: '4', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 7), name: '7', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 8), name: '8', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getMonthForWeeks(weeks, today);

            // Assert
            expect(result).toEqual(novemberMonth);
        });

        it('should fall back to day-counting when today is null', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 9, 26),
                    name: '44',
                    type: PeriodType.Week,
                    weekNumber: 44,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: octoberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 26), name: '26', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 27), name: '27', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 1), name: '1', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 10, 2),
                    name: '45',
                    type: PeriodType.Week,
                    weekNumber: 45,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: novemberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 10, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 3), name: '3', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 4), name: '4', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getMonthForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(novemberMonth);
        });

        it('should return correct month when today is the first day of a week', () => {
            // Arrange
            const today = <Period>{ date: new Date(2026, 10, 2), name: '2', type: PeriodType.Day };
            const weeks = [
                <Week> {
                    date: new Date(2026, 9, 26),
                    name: '44',
                    type: PeriodType.Week,
                    weekNumber: 44,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: octoberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 26), name: '26', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 27), name: '27', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 31), name: '31', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 1), name: '1', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 10, 2),
                    name: '45',
                    type: PeriodType.Week,
                    weekNumber: 45,
                    year: expectedYear,
                    quarter: expectedQuarter,
                    month: novemberMonth,
                    days: [
                        <Period>{ date: new Date(2026, 10, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 3), name: '3', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 4), name: '4', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 7), name: '7', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 10, 8), name: '8', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getMonthForWeeks(weeks, today);

            // Assert
            expect(result).toEqual(novemberMonth);
        });
    });

    describe('getQuarterForWeeks', () => {
        const q3Quarter = <Period> {
            date: new Date(2026, 6),
            name: 'Q3',
            type: PeriodType.Quarter,
        };
        const q4Quarter = <Period> {
            date: new Date(2026, 9),
            name: 'Q4',
            type: PeriodType.Quarter,
        };

        it('should return quarter with most days when counts differ', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 8, 28),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                    year: expectedYear,
                    quarter: q3Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 8, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 1), name: '1', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 9, 5),
                    name: '41',
                    type: PeriodType.Week,
                    weekNumber: 41,
                    year: expectedYear,
                    quarter: q4Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 7), name: '7', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getQuarterForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(q4Quarter);
        });

        it('should prefer earlier quarter when day counts are equal', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 8, 28),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                    year: expectedYear,
                    quarter: q3Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 8, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 30), name: '30', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 9, 5),
                    name: '41',
                    type: PeriodType.Week,
                    weekNumber: 41,
                    year: expectedYear,
                    quarter: q4Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 7), name: '7', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getQuarterForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(q4Quarter);
        });

        it('should handle 2-week end-of-quarter scenario correctly', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 8, 28),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                    year: expectedYear,
                    quarter: q3Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 8, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 1), name: '1', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 3), name: '3', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 4), name: '4', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 9, 5),
                    name: '41',
                    type: PeriodType.Week,
                    weekNumber: 41,
                    year: expectedYear,
                    quarter: q4Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 7), name: '7', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 8), name: '8', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 9), name: '9', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 10), name: '10', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 11), name: '11', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getQuarterForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(q4Quarter);
        });

        it('should handle single week correctly', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2026, 8, 28),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                    year: expectedYear,
                    quarter: q3Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 8, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 29), name: '29', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getQuarterForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(q3Quarter);
        });

        it('should return correct quarter when today is the first day of a week', () => {
            // Arrange
            const today = <Period>{ date: new Date(2026, 9, 5), name: '5', type: PeriodType.Day };
            const weeks = [
                <Week> {
                    date: new Date(2026, 8, 28),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                    year: expectedYear,
                    quarter: q3Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 8, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 8, 30), name: '30', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 9, 5),
                    name: '41',
                    type: PeriodType.Week,
                    weekNumber: 41,
                    year: expectedYear,
                    quarter: q4Quarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 9, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 7), name: '7', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 8), name: '8', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 9), name: '9', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 10), name: '10', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 9, 11), name: '11', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getQuarterForWeeks(weeks, today);

            // Assert
            expect(result).toEqual(q4Quarter);
        });
    });

    describe('getYearForWeeks', () => {
        const year2025 = <Period> {
            date: new Date(2025, 0),
            name: '2025',
            type: PeriodType.Year,
        };
        const year2026 = <Period> {
            date: new Date(2026, 0),
            name: '2026',
            type: PeriodType.Year,
        };

        it('should return year with most days when counts differ', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2025, 11, 28),
                    name: '52',
                    type: PeriodType.Week,
                    weekNumber: 52,
                    year: year2025,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2025, 11, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 1), name: '1', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 0, 5),
                    name: '1',
                    type: PeriodType.Week,
                    weekNumber: 1,
                    year: year2026,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 0, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 7), name: '7', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getYearForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(year2026);
        });

        it('should prefer the current year when day counts are equal', () => {
            // Arrange
            const today = <Period> {
                name: '28',
                date: new Date(2025, 11, 28),
                type: PeriodType.Day,
            };
            const weeks = [
                <Week> {
                    date: today.date,
                    name: '52',
                    type: PeriodType.Week,
                    weekNumber: 52,
                    year: year2025,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2025, 11, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 30), name: '30', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 0, 5),
                    name: '1',
                    type: PeriodType.Week,
                    weekNumber: 1,
                    year: year2026,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 0, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 7), name: '7', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getYearForWeeks(weeks, today);

            // Assert
            expect(result).toEqual(year2025);
        });

        it('should handle 2-week end-of-year scenario correctly', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2025, 11, 28),
                    name: '52',
                    type: PeriodType.Week,
                    weekNumber: 52,
                    year: year2025,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2025, 11, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 31), name: '31', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 1), name: '1', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 3), name: '3', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 0, 5),
                    name: '1',
                    type: PeriodType.Week,
                    weekNumber: 1,
                    year: year2026,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 0, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 7), name: '7', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 8), name: '8', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 9), name: '9', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 10), name: '10', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 11), name: '11', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getYearForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(year2026);
        });

        it('should handle single week correctly', () => {
            // Arrange
            const weeks = [
                <Week> {
                    date: new Date(2025, 11, 28),
                    name: '52',
                    type: PeriodType.Week,
                    weekNumber: 52,
                    year: year2025,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2025, 11, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 29), name: '29', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getYearForWeeks(weeks, null);

            // Assert
            expect(result).toEqual(year2025);
        });

        it('should return correct year when today is the first day of a week', () => {
            // Arrange
            const today = <Period>{ date: new Date(2026, 0, 5), name: '5', type: PeriodType.Day };
            const weeks = [
                <Week> {
                    date: new Date(2025, 11, 28),
                    name: '52',
                    type: PeriodType.Week,
                    weekNumber: 52,
                    year: year2025,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2025, 11, 28), name: '28', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 29), name: '29', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 30), name: '30', type: PeriodType.Day },
                        <Period>{ date: new Date(2025, 11, 31), name: '31', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 1), name: '1', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 2), name: '2', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 3), name: '3', type: PeriodType.Day },
                    ],
                },
                <Week> {
                    date: new Date(2026, 0, 5),
                    name: '1',
                    type: PeriodType.Week,
                    weekNumber: 1,
                    year: year2026,
                    quarter: expectedQuarter,
                    month: expectedMonth,
                    days: [
                        <Period>{ date: new Date(2026, 0, 5), name: '5', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 6), name: '6', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 7), name: '7', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 8), name: '8', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 9), name: '9', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 10), name: '10', type: PeriodType.Day },
                        <Period>{ date: new Date(2026, 0, 11), name: '11', type: PeriodType.Day },
                    ],
                },
            ];

            // Act
            const result = service.getYearForWeeks(weeks, today);

            // Assert
            expect(result).toEqual(year2026);
        });
    });
});