import {PeriodService} from 'src/presentation/contracts/period-service';
import {CalendarService} from 'src/presentation/contracts/calendar-service';

export const mockPeriodService = {
    initialize: jest.fn(),
    openNoteInCurrentTab: jest.fn(),
    openNoteInHorizontalSplitView: jest.fn(),
    openNoteInVerticalSplitView: jest.fn(),
    deleteNote: jest.fn(),
    hasPeriodicNote: jest.fn()
} as jest.Mocked<PeriodService>;

export const mockCalendarService = {
    initialize: jest.fn(),
    getCurrentWeek: jest.fn(),
    getPreviousWeek: jest.fn(),
    getNextWeek: jest.fn(),
    getPreviousMonth: jest.fn(),
    getNextMonth: jest.fn(),
    getMonthForWeeks: jest.fn(),
    getQuarterForWeeks: jest.fn(),
    getYearForWeeks: jest.fn()
} as jest.Mocked<CalendarService>;