import {mockCalendarService} from 'src/test-helpers/service.mocks';
import {DefaultCalendarViewModel} from 'src/presentation/view-models/default.calendar-view-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DayOfWeek, Week} from 'src/domain/models/week';
import {when} from 'jest-when';
import {DEFAULT_GENERAL_SETTINGS} from 'src/domain/settings/general.settings';

describe('DefaultCalendarViewModel', () => {
    const calendarService = mockCalendarService;
    const today = <Period>{
        date: new Date(2023, 9, 2),
        name: '02',
        type: PeriodType.Day
    };

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
            expect(result.startWeekOnMonday).toBe(true);
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
            expect(result.startWeekOnMonday).toBe(false);
            expect(result.month).toEqual(expectedMonth);
            expect(result.quarter).toEqual(expectedQuarter);
            expect(result.year).toEqual(expectedYear);
            expect(result.weeks).toEqual(currentWeek);
            expect(result.today).toEqual(today);
        });
    });
});