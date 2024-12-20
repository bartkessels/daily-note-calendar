import {DefaultCalendarViewModel} from 'src/components/viewmodels/calendar.view-model';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {DateManager} from 'src/domain/managers/date.manager';
import {Enhancer} from 'src/domain/enhancers/enhancer';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';
import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';
import {Week} from 'src/domain/models/week';
import 'src/extensions/extensions';
import {waitFor} from '@testing-library/react';
import {CalendarViewState} from 'src/components/viewmodels/calendar.view-state';

describe('DefaultCalendarViewModel', () => {
    const mockDateManager = {
        getCurrentMonth: jest.fn(),
        getCurrentYear: jest.fn(),
        getCurrentDay: jest.fn(),
        getPreviousMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getYear: jest.fn()
    } as jest.Mocked<DateManager>;
    let mockEnhancer: Enhancer<CalendarUiModel>;
    const selectedDayEvent = new PeriodicNoteEvent<Day>();
    const dailyNoteEvent = new PeriodicNoteEvent<Day>();
    const setUiModel: jest.Mock = jest.fn();

    let currentDay: Day;
    let nextDay: Day;
    let currentWeek: Week;
    let previousMonth: Month;
    let currentMonth: Month;
    let nextMonth: Month;
    let currentYear: Year;

    beforeEach(() => {
        mockEnhancer = new EnhancerDouble();
        currentDay = {date: new Date(2023, 9, 1), dayOfWeek: DayOfWeek.Tuesday, name: '1'};
        nextDay = {date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Wednesday, name: '2'};
        currentWeek = {date: new Date(2023, 9, 1), weekNumber: 40, days: [currentDay, nextDay]};
        previousMonth = {date: new Date(2023, 8), name: 'September', quarter: 3, weeks: []};
        currentMonth = {date: new Date(2023, 9), name: 'October', quarter: 4, weeks: [currentWeek]};
        nextMonth = {date: new Date(2023, 9), name: 'November', quarter: 4, weeks: []};
        currentYear = {date: new Date(2024, 0), name: '2024', months: [currentMonth]};

        mockDateManager.getCurrentDay.mockReturnValue(currentDay);
        mockDateManager.getPreviousMonth.mockReturnValue(previousMonth);
        mockDateManager.getCurrentMonth.mockReturnValue(currentMonth);
        mockDateManager.getNextMonth.mockReturnValue(nextMonth);
        mockDateManager.getCurrentYear.mockReturnValue(currentYear);
        mockDateManager.getYear.mockReturnValue(currentYear);
    });

    afterEach(() => {
        mockDateManager.getCurrentMonth.mockReset();
    })

    function createViewModel(): DefaultCalendarViewModel {
        return new DefaultCalendarViewModel(
            setUiModel,
            selectedDayEvent,
            dailyNoteEvent,
            mockDateManager,
            mockEnhancer
        );
    }

    it('should update the selected day when the selectDayEvent has been emitted', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        selectedDayEvent.emitEvent(nextDay);

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: expect.objectContaining({
                    weeks: expect.arrayContaining([
                        expect.objectContaining({
                            days: expect.arrayContaining([
                                expect.objectContaining({
                                    currentDay: nextDay,
                                    isSelected: true
                                })
                            ])
                        })
                    ])
                }),
                currentYear: currentYear
            }));
        });
    });

    it('should update the selected day when the dailyNoteEvent has been emitted', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        dailyNoteEvent.emitEvent(nextDay);

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: expect.objectContaining({
                    weeks: expect.arrayContaining([
                        expect.objectContaining({
                            days: expect.arrayContaining([
                                expect.objectContaining({
                                    currentDay: nextDay,
                                    isSelected: true
                                })
                            ])
                        })
                    ])
                }),
                currentYear: currentYear
            }));
        });
    });

    it('initializes with the current month, year, and day', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        expect(mockDateManager.getCurrentDay).toHaveBeenCalled();
        expect(mockDateManager.getCurrentMonth).toHaveBeenCalled();
        expect(mockDateManager.getCurrentYear).toHaveBeenCalled();
        expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
            currentMonth: expect.objectContaining({
                month: currentMonth,
                weeks: expect.arrayContaining([
                    expect.objectContaining({
                        days: expect.arrayContaining([
                            expect.objectContaining({
                                currentDay: currentDay,
                                isSelected: true
                            })
                        ])
                    })
                ])
            }),
            currentYear: currentYear
        }));
    });

    it('calls updateViewState during initialization', async () => {
        const viewModel = createViewModel();

        await viewModel.initialize();

        expect(setUiModel).toHaveBeenCalled();
    });

    it('sets the view state to the provided value', () => {
        const viewModel = createViewModel();
        const viewState = {
            currentMonth: currentMonth,
            currentYear: currentYear
        } as CalendarViewState;

        const result = viewModel.withViewState(viewState);

        expect(result.viewState).toBe(viewState);
    });

    it('navigates to the previous month', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        await viewModel.navigateToPreviousMonth();

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: expect.objectContaining({
                    month: previousMonth
                }),
                currentYear: currentYear
            }));
        });
    });

    it('calls getPreviousMonth and getYear with the correct arguments', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        await viewModel.navigateToPreviousMonth();

        expect(mockDateManager.getPreviousMonth).toHaveBeenCalledWith(currentMonth);
        expect(mockDateManager.getYear).toHaveBeenCalledWith(previousMonth);
    });

    it('navigates to the current month', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        await viewModel.navigateToNextMonth();
        await viewModel.navigateToCurrentMonth();

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: expect.objectContaining({
                    month: currentMonth
                }),
                currentYear: currentYear
            }));
        });
    });

    it('calls getCurrentMonth and getYear with the correct arguments', async () => {
        mockDateManager.getCurrentMonth.mockReturnValue(currentMonth);

        const viewModel = createViewModel();
        await viewModel.initialize();

        await viewModel.navigateToCurrentMonth();

        // Two calls because it is called during initialization
        expect(mockDateManager.getCurrentMonth).toHaveBeenCalledTimes(2);
        expect(mockDateManager.getYear).toHaveBeenCalledWith(currentMonth);
    });

    it('navigates to the next month', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        await viewModel.navigateToNextMonth();

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: expect.objectContaining({
                    month: nextMonth
                }),
                currentYear: currentYear
            }));
        });
    });

    it('calls getNextMonth and getYear with the correct arguments', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        await viewModel.navigateToPreviousMonth();

        expect(mockDateManager.getNextMonth).toHaveBeenCalledWith(currentMonth);
        expect(mockDateManager.getYear).toHaveBeenCalledWith(nextMonth);
    });
});

class EnhancerDouble implements Enhancer<CalendarUiModel> {
    private value?: CalendarUiModel;

    withValue(value: CalendarUiModel): Enhancer<CalendarUiModel> {
        this.value = value;
        return this;
    }

    withStep(_: EnhancerStep<CalendarUiModel>): Enhancer<CalendarUiModel> {
        return this;
    }

    async build(): Promise<CalendarUiModel | undefined> {
        return this.value;
    }
}