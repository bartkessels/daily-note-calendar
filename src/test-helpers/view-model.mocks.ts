import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';

export const mockCalendarViewModel = {
    setUpdateViewState: jest.fn(),
    initialize: jest.fn(),
    selectPeriod: jest.fn(),
    openDailyNote: jest.fn(),
    openWeeklyNote: jest.fn(),
    openMonthlyNote: jest.fn(),
    openQuarterlyNote: jest.fn(),
    openYearlyNote: jest.fn(),
    loadCurrentWeek: jest.fn(),
    loadPreviousWeek: jest.fn(),
    loadNextWeek: jest.fn()
} as jest.Mocked<CalendarViewModel>;