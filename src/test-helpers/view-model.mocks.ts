import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';

export const mockCalendarViewModel = {
    setUpdateUiModel: jest.fn(),
    initialize: jest.fn(),
    selectPeriod: jest.fn(),
    openDailyNote: jest.fn(),
    deleteDailyNote: jest.fn(),
    openWeeklyNote: jest.fn(),
    deleteWeeklyNote: jest.fn(),
    openMonthlyNote: jest.fn(),
    deleteMonthlyNote: jest.fn(),
    openQuarterlyNote: jest.fn(),
    deleteQuarterlyNote: jest.fn(),
    openYearlyNote: jest.fn(),
    deleteYearlyNote: jest.fn(),
    loadCurrentWeek: jest.fn(),
    loadPreviousWeek: jest.fn(),
    loadNextWeek: jest.fn(),
    loadPreviousMonth: jest.fn(),
    loadNextMonth: jest.fn()
} as jest.Mocked<CalendarViewModel>;