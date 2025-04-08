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
        type: PeriodType.Month
    };
    const expectedQuarter = <Period> {
        date: new Date(2023, 6),
        name: 'Q3',
        type: PeriodType.Quarter
    };
    const expectedYear = <Period> {
        date: new Date(2023, 0),
        name: '2023',
        type: PeriodType.Year
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

    describe('getCurrentWeek', () => {
        const currentWeek = <Week> {
            date: new Date(2023, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: expectedYear,
            quarter: expectedQuarter,
            month: expectedMonth,
            days: []
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
                    weekNumberStandard: WeekNumberStandard.US
                }
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
                2
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
                3
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
                days: []
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
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
            days: []
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
                    4
                );
            expect(dateManager.getNextWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    1
                );
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US
                }
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
                    4
                );
            expect(dateManager.getNextWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    1
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
                days: []
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
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
            days: []
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
                    2
                );
            expect(dateManager.getNextWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    3
                );
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US
                }
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
                    2
                );
            expect(dateManager.getNextWeeks)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard,
                    3
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
                days: []
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
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
            days: []
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
                    settings.generalSettings.weekNumberStandard
                );
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US
                }
            };

            // Act
            service.initialize(settings);
            service.getPreviousMonth(currentWeeks);

            // Assert
            expect(dateManager.getPreviousMonth)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard
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
                days: []
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
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
            days: []
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
                    settings.generalSettings.weekNumberStandard
                );
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {
            // Arrange
            const settings = <PluginSettings> { ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: <GeneralSettings> { ...DEFAULT_GENERAL_SETTINGS,
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US
                }
            };

            // Act
            service.initialize(settings);
            service.getNextMonth(currentWeeks);

            // Assert
            expect(dateManager.getNextMonth)
                .toHaveBeenCalledWith(
                    currentWeeks[0],
                    settings.generalSettings.firstDayOfWeek,
                    settings.generalSettings.weekNumberStandard
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
                days: []
            };
            const currentWeek = <Week> {
                date: new Date(2023, 9, 9),
                name: '43',
                type: PeriodType.Week,
                weekNumber: 43,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
            };
            const lastWeek = <Week> {
                date: new Date(2023, 9, 16),
                name: '44',
                type: PeriodType.Week,
                weekNumber: 44,
                year: expectedYear,
                quarter: expectedQuarter,
                month: expectedMonth,
                days: []
            };

            when(dateManager.getNextMonth).mockReturnValue([lastWeek, firstWeek, currentWeek]);

            // Act
            const result = service.getNextMonth([currentWeek]);

            // Assert
            expect(result).toEqual([firstWeek, currentWeek, lastWeek]);
        });
    });

    describe('getMonthForWeeks', () => {
        const firstWeek = <Week> {
            date: new Date(2022, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: expectedYear,
            quarter: expectedQuarter,
            month: <Period> {
                date: new Date(2022, 1),
                name: 'February',
                type: PeriodType.Month
            },
            days: []
        };
        const secondWeek = <Week> {
            date: new Date(2023, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: expectedQuarter,
            month: <Period> {
                date: new Date(2023, 2),
                name: 'February',
                type: PeriodType.Month
            },
            days: []
        };
        const thirdWeek = <Week> {
            date: new Date(2025, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: expectedQuarter,
            month: <Period> {
                date: new Date(2025, 2),
                name: 'February',
                type: PeriodType.Month
            },
            days: []
        };
        const fourthWeek = <Week> {
            date: new Date(2026, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: expectedQuarter,
            month: <Period> {
                date: new Date(2026, 2),
                name: 'February',
                type: PeriodType.Month
            },
            days: []
        };
        const fifthWeek = <Week> {
            date: new Date(2027, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: expectedQuarter,
            month: <Period> {
                date: new Date(2027, 2),
                name: 'February',
                type: PeriodType.Month
            },
            days: []
        };
        const sixthWeek = <Week> {
            date: new Date(2028, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: expectedQuarter,
            month: <Period> {
                date: new Date(2028, 2),
                name: 'February',
                type: PeriodType.Month
            },
            days: []
        };
        it('should return the month based on the middle week for an odd number of weeks', () => {
            // Arrange
            const weeks = [firstWeek, secondWeek, thirdWeek];

            // Act
            const result = service.getMonthForWeeks(weeks);

            // Assert
            expect(result).toEqual(secondWeek.month);
        });

        it('should return the month based on the middle week for an even number of weeks', () => {
            // Arrange
            const weeks = [firstWeek, secondWeek, thirdWeek, fourthWeek, fifthWeek, sixthWeek];

            // Act
            const result = service.getMonthForWeeks(weeks);

            // Assert
            expect(result).toEqual(fourthWeek.month);
        });
    });

    describe('getQuarterForWeeks', () => {
        const firstWeek = <Week> {
            date: new Date(2022, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: expectedYear,
            quarter: <Period> {
                date: new Date(2022, 1),
                name: 'Q1',
                type: PeriodType.Quarter
            },
            month: expectedMonth,
            days: []
        };
        const secondWeek = <Week> {
            date: new Date(2023, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: <Period> {
                date: new Date(2023, 1),
                name: 'Q1',
                type: PeriodType.Quarter
            },
            month: expectedMonth,
            days: []
        };
        const thirdWeek = <Week> {
            date: new Date(2025, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: <Period> {
                date: new Date(2025, 1),
                name: 'Q1',
                type: PeriodType.Quarter
            },
            month: expectedMonth,
            days: []
        };
        const fourthWeek = <Week> {
            date: new Date(2026, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: <Period> {
                date: new Date(2026, 1),
                name: 'Q1',
                type: PeriodType.Quarter
            },
            month: expectedMonth,
            days: []
        };
        const fifthWeek = <Week> {
            date: new Date(2027, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: <Period> {
                date: new Date(2027, 1),
                name: 'Q1',
                type: PeriodType.Quarter
            },
            month: expectedMonth,
            days: []
        };
        const sixthWeek = <Week> {
            date: new Date(2028, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: expectedYear,
            quarter: <Period> {
                date: new Date(2028, 1),
                name: 'Q1',
                type: PeriodType.Quarter
            },
            month: expectedMonth,
            days: []
        };
        it('should return the quarter based on the middle week for an odd number of weeks', () => {
            // Arrange
            const weeks = [firstWeek, secondWeek, thirdWeek];

            // Act
            const result = service.getQuarterForWeeks(weeks);

            // Assert
            expect(result).toEqual(secondWeek.quarter);
        });

        it('should return the quarter based on the middle week for an even number of weeks', () => {
            // Arrange
            const weeks = [firstWeek, secondWeek, thirdWeek, fourthWeek, fifthWeek, sixthWeek];

            // Act
            const result = service.getQuarterForWeeks(weeks);

            // Assert
            expect(result).toEqual(fourthWeek.quarter);
        });
    });

    describe('getYearForWeeks', () => {
        const firstWeek = <Week> {
            date: new Date(2022, 9, 2),
            name: '42',
            type: PeriodType.Week,
            weekNumber: 42,
            year: <Period> {
                date: new Date(2022, 0),
                name: '2022',
                type: PeriodType.Year
            },
            quarter: expectedQuarter,
            month: expectedMonth,
            days: []
        };
        const secondWeek = <Week> {
            date: new Date(2023, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: <Period> {
                date: new Date(2023, 0),
                name: '2023',
                type: PeriodType.Year
            },
            quarter: expectedQuarter,
            month: expectedMonth,
            days: []
        };
        const thirdWeek = <Week> {
            date: new Date(2025, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: <Period> {
                date: new Date(2025, 0),
                name: '2025',
                type: PeriodType.Year
            },
            quarter: expectedQuarter,
            month: expectedMonth,
            days: []
        };
        const fourthWeek = <Week> {
            date: new Date(2026, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: <Period> {
                date: new Date(2026, 0),
                name: '2026',
                type: PeriodType.Year
            },
            quarter: expectedQuarter,
            month: expectedMonth,
            days: []
        };
        const fifthWeek = <Week> {
            date: new Date(2027, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: <Period> {
                date: new Date(2027, 0),
                name: '2027',
                type: PeriodType.Year
            },
            quarter: expectedQuarter,
            month: expectedMonth,
            days: []
        };
        const sixthWeek = <Week> {
            date: new Date(2028, 9, 9),
            name: '43',
            type: PeriodType.Week,
            weekNumber: 43,
            year: <Period> {
                date: new Date(2028, 0),
                name: '2028',
                type: PeriodType.Year
            },
            quarter: expectedQuarter,
            month: expectedMonth,
            days: []
        };
        it('should return the year based on the middle week for an odd number of weeks', () => {
            // Arrange
            const weeks = [firstWeek, secondWeek, thirdWeek];

            // Act
            const result = service.getYearForWeeks(weeks);

            // Assert
            expect(result).toEqual(secondWeek.year);
        });

        it('should return the year based on the middle week for an even number of weeks', () => {
            // Arrange
            const weeks = [firstWeek, secondWeek, thirdWeek, fourthWeek, fifthWeek, sixthWeek];

            // Act
            const result = service.getYearForWeeks(weeks);

            // Assert
            expect(result).toEqual(fourthWeek.year);
        });
    });
});