import {mockCalendarService} from 'src/test-helpers/service.mocks';
import {DefaultCalendarViewModel} from 'src/presentation/view-models/default.calendar-view-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DayOfWeek, Week} from 'src/domain/models/week';
import {when} from 'jest-when';
import {DEFAULT_GENERAL_SETTINGS} from 'src/domain/settings/general.settings';
import {Calendar} from 'src/domain/models/calendar.model';

describe('DefaultCalendarViewModel', () => {
    const calendarService = mockCalendarService;
    const today = <Period>{
        date: new Date(2023, 9, 2),
        name: '02',
        type: PeriodType.Day
    };
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
    const weekDays = new Map<DayOfWeek, string[]>([
        [DayOfWeek.Monday, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']],
        [DayOfWeek.Tuesday, ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']],
        [DayOfWeek.Wednesday, ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']],
        [DayOfWeek.Thursday, ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']],
        [DayOfWeek.Friday, ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']],
        [DayOfWeek.Saturday, ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']],
        [DayOfWeek.Sunday, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']]
    ]);

    let viewModel: DefaultCalendarViewModel;

    beforeEach(() => {
        viewModel = new DefaultCalendarViewModel(calendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initialize', () => {
        it('should call initialize on the calendarService', () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            viewModel.initialize(settings, today);

            // Assert
            expect(calendarService.initialize).toHaveBeenCalledWith(settings);
        });
    });

    describe('initializeCallbacks', () => {
        it('should set the callback functions', () => {
            // Arrange
            const expectedSetSelectedPeriod = jest.fn();
            const expectedNavigateToNextWeek = jest.fn();
            const expectedNavigateToPreviousWeek = jest.fn();
            const expectedNavigateToCurrentWeek = jest.fn();
            const expectedNavigateToNextMonth = jest.fn();
            const expectedNavigateToPreviousMonth = jest.fn();

            // Act
            viewModel.initializeCallbacks(
                expectedSetSelectedPeriod,
                expectedNavigateToNextWeek,
                expectedNavigateToPreviousWeek,
                expectedNavigateToCurrentWeek,
                expectedNavigateToNextMonth,
                expectedNavigateToPreviousMonth
            );

            // Assert
            expect(viewModel.setSelectedPeriod).toBe(expectedSetSelectedPeriod);
            expect(viewModel.navigateToNextWeek).toBe(expectedNavigateToNextWeek);
            expect(viewModel.navigateToPreviousWeek).toBe(expectedNavigateToPreviousWeek);
            expect(viewModel.navigateToCurrentWeek).toBe(expectedNavigateToCurrentWeek);
            expect(viewModel.navigateToNextMonth).toBe(expectedNavigateToNextMonth);
            expect(viewModel.navigateToPreviousMonth).toBe(expectedNavigateToPreviousMonth);
        });
    });

    describe('getCurrentWeek', () => {
        const currentWeek = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            }
        ];

        beforeEach(() => {
            when(calendarService.getCurrentWeek).mockReturnValue(currentWeek);
            when(calendarService.getMonthForWeeks).calledWith(currentWeek).mockReturnValue(expectedMonth);
            when(calendarService.getQuarterForWeeks).calledWith(currentWeek).mockReturnValue(expectedQuarter);
            when(calendarService.getYearForWeeks).calledWith(currentWeek).mockReturnValue(expectedYear);
        });

        it('should use the default settings for the startWeekOnMonday and today should be null when the view model is not initialized', async () => {
            // Act
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(currentWeek);
            expect(result.today).toBeNull();
        });

        it('should use the custom settings for the startWeekOnMonday and today should not be null when the view model is initialized', async () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Sunday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(currentWeek);
            expect(result.today).toEqual(today);
        });

        it('should allow any day of the week to be the first day of the week', () => {
            // Arrange
            weekDays.forEach((days, firstDayOfWeek) => {
                const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: firstDayOfWeek }};

                // Act
                viewModel.initialize(settings, today);
                const result = viewModel.getCurrentWeek();

                // Assert
                expect(result.weekDays).toEqual(days);
                expect(result.month).toEqual(expectedMonth);
                expect(result.quarter).toEqual(expectedQuarter);
                expect(result.year).toEqual(expectedYear);
                expect(result.weeks).toEqual(currentWeek);
                expect(result.today).toEqual(today);
            });
        });
    });

    describe('getPreviousWeek', () => {
        const currentCalendar = <Calendar> {
            weekDays: [],
            month: expectedMonth,
            quarter: expectedQuarter,
            year: expectedYear,
            weeks: [
                <Week>{
                    date: new Date(2023, 9, 2),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                }
            ],
            today: null
        }

        const previousWeek = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            }
        ];

        beforeEach(() => {
            when(calendarService.getPreviousWeek).mockReturnValue(previousWeek);
            when(calendarService.getMonthForWeeks).calledWith(previousWeek).mockReturnValue(expectedMonth);
            when(calendarService.getQuarterForWeeks).calledWith(previousWeek).mockReturnValue(expectedQuarter);
            when(calendarService.getYearForWeeks).calledWith(previousWeek).mockReturnValue(expectedYear);
        });

        it('should use the default settings for the startWeekOnMonday and today should be null when the view model is not initialized', async () => {
            // Act
            const result = viewModel.getPreviousWeek(currentCalendar);

            // Assert
            expect(result.weekDays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(previousWeek);
            expect(result.today).toBeNull();
        });

        it('should use the custom settings for the startWeekOnMonday and today should not be null when the view model is initialized', async () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Sunday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getPreviousWeek(currentCalendar);

            // Assert
            expect(result.weekDays).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(previousWeek);
            expect(result.today).toEqual(today);
        });

        it('should allow any day of the week to be the first day of the week', () => {
            // Arrange
            weekDays.forEach((days, firstDayOfWeek) => {
                const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: firstDayOfWeek }};

                // Act
                viewModel.initialize(settings, today);
                const result = viewModel.getPreviousWeek(currentCalendar);

                // Assert
                expect(result.weekDays).toEqual(days);
                expect(result.month).toEqual(expectedMonth);
                expect(result.quarter).toEqual(expectedQuarter);
                expect(result.year).toEqual(expectedYear);
                expect(result.weeks).toEqual(previousWeek);
                expect(result.today).toEqual(today);
            });
        });
    });

    describe('getNextWeek', () => {
        const currentCalendar = <Calendar> {
            weekDays: [],
            month: expectedMonth,
            quarter: expectedQuarter,
            year: expectedYear,
            weeks: [
                <Week>{
                    date: new Date(2023, 9, 2),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                }
            ],
            today: null
        }

        const nextWeek = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            }
        ];

        beforeEach(() => {
            when(calendarService.getNextWeek).mockReturnValue(nextWeek);
            when(calendarService.getMonthForWeeks).calledWith(nextWeek).mockReturnValue(expectedMonth);
            when(calendarService.getQuarterForWeeks).calledWith(nextWeek).mockReturnValue(expectedQuarter);
            when(calendarService.getYearForWeeks).calledWith(nextWeek).mockReturnValue(expectedYear);
        });

        it('should use the default settings for the startWeekOnMonday and today should be null when the view model is not initialized', async () => {
            // Act
            const result = viewModel.getNextWeek(currentCalendar);

            // Assert
            expect(result.weekDays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(nextWeek);
            expect(result.today).toBeNull();
        });

        it('should use the custom settings for the startWeekOnMonday and today should not be null when the view model is initialized', async () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Sunday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getNextWeek(currentCalendar);

            // Assert
            expect(result.weekDays).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(nextWeek);
            expect(result.today).toEqual(today);
        });

        it('should allow any day of the week to be the first day of the week', () => {
            // Arrange
            weekDays.forEach((days, firstDayOfWeek) => {
                const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: firstDayOfWeek }};

                // Act
                viewModel.initialize(settings, today);
                const result = viewModel.getNextWeek(currentCalendar);

                // Assert
                expect(result.weekDays).toEqual(days);
                expect(result.month).toEqual(expectedMonth);
                expect(result.quarter).toEqual(expectedQuarter);
                expect(result.year).toEqual(expectedYear);
                expect(result.weeks).toEqual(nextWeek);
                expect(result.today).toEqual(today);
            });
        });
    });

    describe('getPreviousMonth', () => {
        const currentCalendar = <Calendar> {
            weekDays: [],
            month: expectedMonth,
            quarter: expectedQuarter,
            year: expectedYear,
            weeks: [
                <Week>{
                    date: new Date(2023, 9, 2),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                }
            ],
            today: null
        }

        const previousMonth = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            }
        ];

        beforeEach(() => {
            when(calendarService.getPreviousMonth).mockReturnValue(previousMonth);
            when(calendarService.getMonthForWeeks).calledWith(previousMonth).mockReturnValue(expectedMonth);
            when(calendarService.getQuarterForWeeks).calledWith(previousMonth).mockReturnValue(expectedQuarter);
            when(calendarService.getYearForWeeks).calledWith(previousMonth).mockReturnValue(expectedYear);
        });

        it('should use the default settings for the startWeekOnMonday and today should be null when the view model is not initialized', async () => {
            // Act
            const result = viewModel.getPreviousMonth(currentCalendar);

            // Assert
            expect(result.weekDays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(previousMonth);
            expect(result.today).toBeNull();
        });

        it('should use the custom settings for the startWeekOnMonday and today should not be null when the view model is initialized', async () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Sunday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getPreviousMonth(currentCalendar);

            // Assert
            expect(result.weekDays).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(previousMonth);
            expect(result.today).toEqual(today);
        });

        it('should allow any day of the week to be the first day of the week', () => {
            // Arrange
            weekDays.forEach((days, firstDayOfWeek) => {
                const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: firstDayOfWeek }};

                // Act
                viewModel.initialize(settings, today);
                const result = viewModel.getPreviousMonth(currentCalendar);

                // Assert
                expect(result.weekDays).toEqual(days);
                expect(result.month).toEqual(expectedMonth);
                expect(result.quarter).toEqual(expectedQuarter);
                expect(result.year).toEqual(expectedYear);
                expect(result.weeks).toEqual(previousMonth);
                expect(result.today).toEqual(today);
            });
        });
    });

    describe('getNextMonth', () => {
        const currentCalendar = <Calendar> {
            weekDays: [],
            month: expectedMonth,
            quarter: expectedQuarter,
            year: expectedYear,
            weeks: [
                <Week>{
                    date: new Date(2023, 9, 2),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                }
            ],
            today: null
        }

        const nextMonth = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            }
        ];

        beforeEach(() => {
            when(calendarService.getNextMonth).mockReturnValue(nextMonth);
            when(calendarService.getMonthForWeeks).calledWith(nextMonth).mockReturnValue(expectedMonth);
            when(calendarService.getQuarterForWeeks).calledWith(nextMonth).mockReturnValue(expectedQuarter);
            when(calendarService.getYearForWeeks).calledWith(nextMonth).mockReturnValue(expectedYear);
        });

        it('should use the default settings for the first day of the week and today should be null when the view model is not initialized', async () => {
            // Act
            const result = viewModel.getNextMonth(currentCalendar);

            // Assert
            expect(result.weekDays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(nextMonth);
            expect(result.today).toBeNull();
        });

        it('should allow any day of the week to be the first day of the week', () => {
            // Arrange
            weekDays.forEach((days, firstDayOfWeek) => {
                const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: firstDayOfWeek }};

                // Act
                viewModel.initialize(settings, today);
                const result = viewModel.getNextMonth(currentCalendar);

                // Assert
                expect(result.weekDays).toEqual(days);
                expect(result.month).toEqual(expectedMonth);
                expect(result.quarter).toEqual(expectedQuarter);
                expect(result.year).toEqual(expectedYear);
                expect(result.weeks).toEqual(nextMonth);
                expect(result.today).toEqual(today);
            });
        });
    });

    describe('getWeekForPeriod', () => {
        it('should show December 2025 when selecting December 29, 2025 (edge case: day in ISO week 1 of 2026)', () => {
            // Arrange
            const december29 = <Period> {
                date: new Date(2025, 11, 29), // December 29, 2025 (month is 0-indexed)
                name: '29',
                type: PeriodType.Day
            };
            
            const expectedDecemberMonth = <Period> {
                date: new Date(2025, 11, 1),
                name: 'December',
                type: PeriodType.Month
            };
            
            const expectedQ4 = <Period> {
                date: new Date(2025, 9, 1),
                name: 'Q4',
                type: PeriodType.Quarter
            };
            
            const expected2025Year = <Period> {
                date: new Date(2025, 0, 1),
                name: '2025',
                type: PeriodType.Year
            };

            // Create a week that spans Dec 29, 2025 - Jan 4, 2026
            const week = <Week> {
                date: new Date(2025, 11, 29),
                name: '01',
                type: PeriodType.Week,
                weekNumber: 1,
                year: <Period> { date: new Date(2026, 0, 1), name: '2026', type: PeriodType.Year }, // ISO week year is 2026
                quarter: expectedQ4,
                month: expectedDecemberMonth,
                days: [
                    <Period> { date: new Date(2025, 11, 29), name: '29', type: PeriodType.Day }, // Mon Dec 29
                    <Period> { date: new Date(2025, 11, 30), name: '30', type: PeriodType.Day }, // Tue Dec 30
                    <Period> { date: new Date(2025, 11, 31), name: '31', type: PeriodType.Day }, // Wed Dec 31
                    <Period> { date: new Date(2026, 0, 1), name: '01', type: PeriodType.Day },   // Thu Jan 1
                    <Period> { date: new Date(2026, 0, 2), name: '02', type: PeriodType.Day },   // Fri Jan 2
                    <Period> { date: new Date(2026, 0, 3), name: '03', type: PeriodType.Day },   // Sat Jan 3
                    <Period> { date: new Date(2026, 0, 4), name: '04', type: PeriodType.Day }    // Sun Jan 4
                ]
            };

            when(calendarService.getWeekForPeriod).calledWith(december29).mockReturnValue([week]);
            when(calendarService.getMonthForWeeks).calledWith([week]).mockReturnValue(expectedDecemberMonth);
            when(calendarService.getQuarterForWeeks).calledWith([week]).mockReturnValue(expectedQ4);
            when(calendarService.getYearForWeeks).calledWith([week]).mockReturnValue(expected2025Year);

            // Act
            const result = viewModel.getWeekForPeriod(december29);

            // Assert
            expect(result.month).toEqual(expectedDecemberMonth);
            expect(result.month.name).toBe('December');
            expect(result.year).toEqual(expected2025Year);
            expect(result.year.name).toBe('2025');
            expect(result.quarter).toEqual(expectedQ4);
        });
    });
});
