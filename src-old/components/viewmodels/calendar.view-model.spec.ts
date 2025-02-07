import {DefaultCalendarViewModel} from 'src-old/components/viewmodels/calendar.view-model';
import {Day, DayOfWeek} from 'src-old/domain/models/day';
import {Month} from 'src-old/domain/models/month';
import {Year} from 'src-old/domain/models/year';
import {CalendarUiModel} from 'src-old/components/models/calendar.ui-model';
import {DateManager} from 'src-old/domain/managers/date.manager';
import {Enhancer} from 'src-old/domain/enhancers/enhancer';
import {Week} from 'src-old/domain/models/week';
import {waitFor} from '@testing-library/react';
import {CalendarViewState} from 'src-old/components/viewmodels/calendar.view-state';
import 'src-old/extensions/extensions';
import {PeriodicManageEvent} from 'src-old/implementation/events/periodic.manage-event';
import {ManageAction} from 'src-old/domain/events/manage.event';

describe('DefaultCalendarViewModel', () => {
    const mockDateManager = {
        getCurrentMonth: jest.fn(),
        getCurrentYear: jest.fn(),
        getCurrentDay: jest.fn(),
        getMonth: jest.fn(),
        getPreviousMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getYear: jest.fn()
    } as jest.Mocked<DateManager>;
    let mockEnhancer: Enhancer<CalendarUiModel>;
    const manageDayEvent = new PeriodicManageEvent<Day>();
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
        currentWeek = {date: new Date(2023, 9, 1), weekNumber: '40', days: [currentDay, nextDay]};
        previousMonth = {date: new Date(2023, 8), name: 'September', quarter: { date: new Date(2023), quarter: 3, year: 2023 }, weeks: []};
        currentMonth = {date: new Date(2023, 9), name: 'October', quarter: { date: new Date(2023), quarter: 4, year: 2023 }, weeks: [currentWeek]};
        nextMonth = {date: new Date(2023, 9), name: 'November', quarter: { date: new Date(2023), quarter: 4, year: 2023 }, weeks: []};
        currentYear = {date: new Date(2023, 0), name: '2023'};

        mockDateManager.getCurrentDay.mockReturnValue(currentDay);
        mockDateManager.getPreviousMonth.mockResolvedValue(previousMonth);
        mockDateManager.getCurrentMonth.mockResolvedValue(currentMonth);
        mockDateManager.getNextMonth.mockResolvedValue(nextMonth);
        mockDateManager.getCurrentYear.mockResolvedValue(currentYear);
        mockDateManager.getYear.mockResolvedValue(currentYear);
    });

    afterEach(() => {
        mockDateManager.getCurrentMonth.mockReset();
    })

    function createViewModel(): DefaultCalendarViewModel {
        return new DefaultCalendarViewModel(
            setUiModel,
            manageDayEvent,
            mockDateManager,
            mockEnhancer
        );
    }

    it('should update the selected day with the current month when the manageEvent has been emitted with the preview action', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        mockDateManager.getMonth.mockResolvedValue(currentMonth);
        mockDateManager.getYear.mockResolvedValue(currentYear);

        manageDayEvent.emitEvent(ManageAction.Preview, nextDay);

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: expect.objectContaining({
                    month: currentMonth,
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
                currentYear: currentYear,
                startWeekOnMonday: true
            }));
        });
    });

    it('should update the selected day with the next month when the manageEvent has been emitted with the preview action', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        const day = {date: new Date(2024, 1, 1), dayOfWeek: DayOfWeek.Monday, name: '1'};
        const week = {date: new Date(2024, 1, 1), weekNumber: '1', days: [day]};
        const expectedMonth = {
            date: new Date(2024, 1),
            name: 'January',
            quarter: {date: new Date(2024), quarter: 1, year: 2024},
            weeks: [week]
        };
        const expectedYear = {date: new Date(2024, 0), name: '2024', months: [expectedMonth]};

        mockDateManager.getMonth.mockResolvedValue(expectedMonth);
        mockDateManager.getYear.mockResolvedValue(expectedYear);

        manageDayEvent.emitEvent(ManageAction.Preview, day);

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: expect.objectContaining({
                    month: expectedMonth,
                    weeks: expect.arrayContaining([
                        expect.objectContaining({
                            days: expect.arrayContaining([
                                expect.objectContaining({
                                    currentDay: day,
                                    isSelected: true
                                })
                            ])
                        })
                    ])
                }),
                currentYear: expectedYear,
                startWeekOnMonday: true
            }));
        });
    });

    it('should update the selected day when the manageDayEvent has been emitted with the open', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        mockDateManager.getMonth.mockResolvedValue(currentMonth);
        mockDateManager.getYear.mockResolvedValue(currentYear);

        manageDayEvent.emitEvent(ManageAction.Open, nextDay);

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
                currentYear: currentYear,
                startWeekOnMonday: true
            }));
        });
    });

    it('should update the selected day with the next month when the manageEvent has been emitted with the open action', async () => {
        const viewModel = createViewModel();
        await viewModel.initialize();

        const day = {date: new Date(2024, 1, 1), dayOfWeek: DayOfWeek.Monday, name: '1'};
        const week = {date: new Date(2024, 1, 1), weekNumber: '1', days: [day]};
        const expectedMonth = {
            date: new Date(2024, 1),
            name: 'January',
            quarter: {date: new Date(2024), quarter: 1, year: 2024},
            weeks: [week]
        };
        const expectedYear = {date: new Date(2024, 0), name: '2024', months: [expectedMonth]};

        mockDateManager.getMonth.mockResolvedValue(expectedMonth);
        mockDateManager.getYear.mockResolvedValue(expectedYear);

        manageDayEvent.emitEvent(ManageAction.Open, day);

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: expect.objectContaining({
                    month: expectedMonth,
                    weeks: expect.arrayContaining([
                        expect.objectContaining({
                            days: expect.arrayContaining([
                                expect.objectContaining({
                                    currentDay: day,
                                    isSelected: true
                                })
                            ])
                        })
                    ])
                }),
                currentYear: expectedYear,
                startWeekOnMonday: true
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
            currentYear: currentYear,
            startWeekOnMonday: true
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
                currentYear: currentYear,
                startWeekOnMonday: true
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
                currentYear: currentYear,
                startWeekOnMonday: true
            }));
        });
    });

    it('calls getCurrentMonth and getYear with the correct arguments', async () => {
        mockDateManager.getCurrentMonth.mockResolvedValue(currentMonth);

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
                currentYear: currentYear,
                startWeekOnMonday: true
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

    async build(): Promise<CalendarUiModel | undefined> {
        return this.value;
    }
}
