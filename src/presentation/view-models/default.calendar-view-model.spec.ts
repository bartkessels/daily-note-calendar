import {mockCalendarService} from 'src/test-helpers/service.mocks';
import {DefaultCalendarViewModel} from 'src/presentation/view-models/default.calendar-view-model';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {Week} from 'src/domain/models/week';
import {when} from 'jest-when';

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
        });

        it('should use the default settings for the startWeekOnMonday property when no settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;


        });

        it('should return a calendar object with the expected properties', async () => {
            // Arrange
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

            // TODO: Implement the rest of the test cases
        })
    });
});