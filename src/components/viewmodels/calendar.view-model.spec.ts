import { DefaultCalendarViewModel } from 'src/components/viewmodels/calendar.view-model';
import { Day, DayOfWeek } from 'src/domain/models/day';
import { Month } from 'src/domain/models/month';
import { Year } from 'src/domain/models/year';
import { CalendarUiModel } from 'src/components/models/calendar.ui-model';
import { Event } from 'src/domain/events/event';
import { DateManager } from 'src/domain/managers/date.manager';
import { Enhancer } from 'src/domain/enhancers/enhancer';
import {createMonthUiModel} from 'src/components/models/month.ui-model';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';
import {waitFor} from '@testing-library/react';

jest.mock('src/domain/managers/date.manager');
jest.mock('src/domain/enhancers/enhancer');

describe('DefaultCalendarViewModel', () => {
    const mockDateManager = {
        getCurrentMonth: jest.fn(),
        getCurrentYear: jest.fn(),
        getCurrentDay: jest.fn(),
        getPreviousMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getYear: jest.fn()
    } as jest.Mocked<DateManager>;
    const mockEnhancer = {
        withValue: jest.fn(),
        withStep: jest.fn(),
        build: jest.fn((value?: CalendarUiModel) => Promise.resolve(value))
    } as unknown as jest.Mocked<Enhancer<CalendarUiModel>>;
    const selectedDayEvent = new PeriodicNoteEvent<Day>();
    const dailyNoteEvent = new PeriodicNoteEvent<Day>();
    const setUiModel: jest.Mock = jest.fn();

    let currentDay: Day;
    let currentMonth: Month;
    let currentYear: Year;

    beforeEach(() => {
        currentDay = { date: new Date(2023, 9, 1), dayOfWeek: DayOfWeek.Sunday, name: '1' };
        currentMonth = { date: new Date(2023, 9), name: 'October', quarter: 4, weeks: [] };
        currentYear = { date: new Date(2024, 0), name: '2024', months: [currentMonth] };

        mockDateManager.getCurrentDay.mockReturnValue(currentDay);
        mockDateManager.getCurrentMonth.mockReturnValue(currentMonth);
        mockDateManager.getCurrentYear.mockReturnValue(currentYear);
        mockEnhancer.withValue.mockReturnValue(mockEnhancer);
    });

    function createViewModel(): DefaultCalendarViewModel {
        return new DefaultCalendarViewModel(
            setUiModel,
            selectedDayEvent,
            dailyNoteEvent,
            mockDateManager,
            mockEnhancer
        );
    }

    it('initializes with the current month, year, and day', async () => {
        const viewModel = createViewModel();
        const monthUiModel = createMonthUiModel(currentMonth);

        // await viewModel.updateViewState();
        dailyNoteEvent.emitEvent(currentDay);

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(expect.objectContaining<CalendarUiModel>({
                currentMonth: monthUiModel,
                currentYear: currentYear
            }));
        })

        // expect(viewModel.viewState.uiModel?.currentMonth?.month?.name).toBe('October');
        // expect(viewModel.viewState.uiModel?.currentYear?.name).toBe('2024');
    });

    it('navigates to the previous month', async () => {
        const previousMonth = { date: new Date(2023, 8), name: 'September', quarter: 3, weeks: [] };
        mockDateManager.getPreviousMonth.mockReturnValue(previousMonth);

        const viewModel = createViewModel();
        viewModel.navigateToPreviousMonth();

        // await viewModel.updateViewState();

        expect(viewModel.viewState.uiModel?.currentMonth?.month?.name).toBe('September');
    });

    it('navigates to the next month', async () => {
        const nextMonth = { date: new Date(2023, 10), name: 'November', quarter: 4, weeks: [] };
        mockDateManager.getNextMonth.mockReturnValue(nextMonth);

        const viewModel = createViewModel();
        viewModel.navigateToNextMonth();

        // await viewModel.updateViewState();

        expect(viewModel.viewState.uiModel?.currentMonth?.month?.name).toBe('November');
    });

    it('navigates to the current month', async () => {
        const viewModel = createViewModel();
        viewModel.navigateToCurrentMonth();

        // await viewModel.updateViewState();

        expect(viewModel.viewState.uiModel?.currentMonth?.month?.name).toBe('October');
    });

    it('updates the selected day when selectDayEvent is triggered', async () => {
        const newDay: Day = { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' };

        const viewModel = createViewModel();
        // mockSelectDayEvent.emitEvent(newDay);

        // await viewModel.updateViewState();

        // expect(viewModel.viewState.uiModel?.currentMonth?.name).toBe('2');
    });

    it('updates the selected day when dailyNoteEvent is triggered', async () => {
        const newDay: Day = { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' };

        const viewModel = createViewModel();
        // mockDailyNoteEvent.emitEvent(newDay);

        // await viewModel.updateViewState();

        // expect(viewModel.viewState.uiModel?.selectedDay?.name).toBe('2');
    });
});