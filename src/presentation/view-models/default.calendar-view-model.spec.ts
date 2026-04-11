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
        type: PeriodType.Day,
    };
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
    const weekDays = new Map<DayOfWeek, string[]>([
        [DayOfWeek.Monday, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']],
        [DayOfWeek.Tuesday, ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']],
        [DayOfWeek.Wednesday, ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']],
        [DayOfWeek.Thursday, ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']],
        [DayOfWeek.Friday, ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']],
        [DayOfWeek.Saturday, ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']],
        [DayOfWeek.Sunday, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']],
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
                expectedNavigateToPreviousMonth,
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

    describe('initializeNoteCountRefreshCallback', () => {
        it('should store the provided callback as refreshNoteCounts', () => {
            // Arrange
            const cb = jest.fn();

            // Act
            viewModel.initializeNoteCountRefreshCallback(cb);

            // Assert
            expect(viewModel.refreshNoteCounts).toBe(cb);
        });

        it('should invoke the callback when refreshNoteCounts is called', () => {
            // Arrange
            const cb = jest.fn();
            viewModel.initializeNoteCountRefreshCallback(cb);

            // Act
            viewModel.refreshNoteCounts!();

            // Assert
            expect(cb).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCurrentWeek', () => {
        const currentWeek = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            },
        ];

        beforeEach(() => {
            when(calendarService.getCurrentWeek).mockReturnValue(currentWeek);
            when(calendarService.getMonthForWeeks).mockReturnValue(expectedMonth);
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

        it('should calculate correct startIndex for Monday as first day of week', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Monday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays[0]).toBe('Mon');
            expect(result.weekDays[6]).toBe('Sun');
        });

        it('should calculate correct startIndex for Sunday as first day of week', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Sunday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays[0]).toBe('Sun');
            expect(result.weekDays[6]).toBe('Sat');
        });

        it('should calculate correct startIndex for Tuesday as first day of week', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Tuesday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays[0]).toBe('Tue');
            expect(result.weekDays).toEqual(['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']);
        });

        it('should calculate correct startIndex for Wednesday as first day of week', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Wednesday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays[0]).toBe('Wed');
            expect(result.weekDays).toEqual(['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']);
        });

        it('should calculate correct startIndex for Thursday as first day of week', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Thursday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays[0]).toBe('Thu');
            expect(result.weekDays).toEqual(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']);
        });

        it('should calculate correct startIndex for Friday as first day of week', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Friday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays[0]).toBe('Fri');
            expect(result.weekDays).toEqual(['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']);
        });

        it('should calculate correct startIndex for Saturday as first day of week', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Saturday }};

            // Act
            viewModel.initialize(settings, today);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.weekDays[0]).toBe('Sat');
            expect(result.weekDays).toEqual(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
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
                },
            ],
            today: null,
        };

        const previousWeek = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            },
        ];

        beforeEach(() => {
            when(calendarService.getPreviousWeek).mockReturnValue(previousWeek);
            when(calendarService.getMonthForWeeks).mockReturnValue(expectedMonth);
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
                },
            ],
            today: null,
        };

        const nextWeek = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            },
        ];

        beforeEach(() => {
            when(calendarService.getNextWeek).mockReturnValue(nextWeek);
            when(calendarService.getMonthForWeeks).mockReturnValue(expectedMonth);
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
                },
            ],
            today: null,
        };

        const previousMonth = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            },
        ];

        beforeEach(() => {
            when(calendarService.getPreviousMonth).mockReturnValue(previousMonth);
            when(calendarService.getMonthForWeeks).mockReturnValue(expectedMonth);
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
                },
            ],
            today: null,
        };

        const nextMonth = [
            <Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            },
        ];

        beforeEach(() => {
            when(calendarService.getNextMonth).mockReturnValue(nextMonth);
            when(calendarService.getMonthForWeeks).mockReturnValue(expectedMonth);
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

    describe('updateToday', () => {
        it('should update the today field and use it when building calendars', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Monday }};
            const initialToday = <Period>{
                date: new Date(2023, 8, 1),
                name: '01',
                type: PeriodType.Day,
            };
            const newToday = <Period>{
                date: new Date(2023, 9, 2),
                name: '02',
                type: PeriodType.Day,
            };
            const currentWeek = [
                <Week>{
                    date: new Date(2023, 9, 2),
                    name: '40',
                    type: PeriodType.Week,
                    weekNumber: 40,
                },
            ];

            when(calendarService.getCurrentWeek).mockReturnValue(currentWeek);
            when(calendarService.getMonthForWeeks).mockReturnValue(expectedMonth);
            when(calendarService.getQuarterForWeeks).calledWith(currentWeek).mockReturnValue(expectedQuarter);
            when(calendarService.getYearForWeeks).calledWith(currentWeek).mockReturnValue(expectedYear);

            viewModel.initialize(settings, initialToday);

            // Act
            viewModel.updateToday(newToday);
            const result = viewModel.getCurrentWeek();

            // Assert
            expect(result.today).toEqual(newToday);
        });

        it('should not trigger navigation when today is updated', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Monday }};
            const initialToday = <Period>{
                date: new Date(2023, 8, 1),
                name: '01',
                type: PeriodType.Day,
            };
            const newToday = <Period>{
                date: new Date(2023, 9, 2),
                name: '02',
                type: PeriodType.Day,
            };
            const navigateToCurrentWeekMock = jest.fn();

            viewModel.initialize(settings, initialToday);
            viewModel.initializeCallbacks(
                jest.fn(),
                jest.fn(),
                jest.fn(),
                navigateToCurrentWeekMock,
                jest.fn(),
                jest.fn(),
            );

            // Act
            viewModel.updateToday(newToday);

            // Assert
            expect(navigateToCurrentWeekMock).not.toHaveBeenCalled();
        });
    });

    describe('initializeCalendarRefreshCallback', () => {
        it('should store the provided callback and invoke it when refreshCalendar is called', () => {
            // Arrange
            const callback = jest.fn();
            
            // Act
            viewModel.initializeCalendarRefreshCallback(callback);
            viewModel.refreshCalendar();
            
            // Assert
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('rebuildCalendar', () => {
        it('should rebuild calendar with provided weeks and current today', () => {
            // Arrange
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS, generalSettings: { ...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Monday }};
            const today = <Period>{
                date: new Date(2023, 9, 2),
                name: '02',
                type: PeriodType.Day,
            };
            const weeks = [<Week>{
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                weekNumber: 40,
            }];

            when(calendarService.getMonthForWeeks).mockReturnValue(expectedMonth);
            when(calendarService.getQuarterForWeeks).calledWith(weeks).mockReturnValue(expectedQuarter);
            when(calendarService.getYearForWeeks).calledWith(weeks).mockReturnValue(expectedYear);

            viewModel.initialize(settings, today);

            // Act
            const result = viewModel.rebuildCalendar(weeks);

            // Assert
            expect(result.weeks).toEqual(weeks);
            expect(result.today).toEqual(today);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
        });
    });
});