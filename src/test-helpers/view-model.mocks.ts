import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';
import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import {DayNoteViewModel} from 'src/presentation/contracts/day.view-model';
import {NotesViewModel} from 'src/presentation/contracts/notes.view-model';

export const mockCalendarViewModel = {
    setSelectedPeriod: jest.fn(),
    navigateToNextWeek: jest.fn(),
    navigateToPreviousWeek: jest.fn(),
    navigateToCurrentWeek: jest.fn(),
    navigateToNextMonth: jest.fn(),
    navigateToPreviousMonth: jest.fn(),
    refreshNoteCounts: jest.fn(),
    refreshCalendar: jest.fn(),

    initialize: jest.fn(),
    updateToday: jest.fn(),
    initializeCallbacks: jest.fn(),
    initializeNoteCountRefreshCallback: jest.fn(),
    initializeCalendarRefreshCallback: jest.fn(),
    getCurrentWeek: jest.fn(),
    getPreviousWeek: jest.fn(),
    getNextWeek: jest.fn(),
    getPreviousMonth: jest.fn(),
    getNextMonth: jest.fn(),
    rebuildCalendar: jest.fn(),
} as jest.Mocked<CalendarViewModel>;

export const mockPeriodNoteViewModel = {
    updateSettings: jest.fn(),
    hasPeriodicNote: jest.fn(),
    openNote: jest.fn(),
    openNoteInHorizontalSplitView: jest.fn(),
    openNoteInVerticalSplitView: jest.fn(),
    deleteNote: jest.fn(),
} as jest.Mocked<PeriodNoteViewModel>;

export const mockDayNoteViewModel = {
    updateSettings: jest.fn(),
    hasPeriodicNote: jest.fn(),
    openNote: jest.fn(),
    openNoteInHorizontalSplitView: jest.fn(),
    openNoteInVerticalSplitView: jest.fn(),
    deleteNote: jest.fn(),
    getNoteCount: jest.fn(),
} as jest.Mocked<DayNoteViewModel>;

export const mockNotesViewModel = {
    updateNotes: jest.fn(),

    initializeCallbacks: jest.fn(),
    loadNotes: jest.fn(),
    openNote: jest.fn(),
    openNoteInHorizontalSplitView: jest.fn(),
    openNoteInVerticalSplitView: jest.fn(),
    deleteNote: jest.fn(),
} as jest.Mocked<NotesViewModel>;