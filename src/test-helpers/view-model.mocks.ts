import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';
import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import {NotesViewModel} from 'src/presentation/contracts/notes.view-model';

export const mockCalendarViewModel = {
    setSelectedPeriod: jest.fn(),
    navigateToNextWeek: jest.fn(),
    navigateToPreviousWeek: jest.fn(),
    navigateToCurrentWeek: jest.fn(),
    navigateToNextMonth: jest.fn(),
    navigateToPreviousMonth: jest.fn(),

    initialize: jest.fn(),
    initializeCallbacks: jest.fn(),
    getCurrentWeek: jest.fn(),
    getPreviousWeek: jest.fn(),
    getNextWeek: jest.fn(),
    getPreviousMonth: jest.fn(),
    getNextMonth: jest.fn()
} as jest.Mocked<CalendarViewModel>;

export const mockPeriodNoteViewModel = {
    updateSettings: jest.fn(),
    hasPeriodicNote: jest.fn(),
    openNote: jest.fn(),
    openNoteInHorizontalSplitView: jest.fn(),
    openNoteInVerticalSplitView: jest.fn(),
    deleteNote: jest.fn()
} as jest.Mocked<PeriodNoteViewModel>;

export const mockNotesViewModel = {
    loadNotes: jest.fn(),
    openNote: jest.fn(),
    openNoteInHorizontalSplitView: jest.fn(),
    openNoteInVerticalSplitView: jest.fn(),
    deleteNote: jest.fn()
} as jest.Mocked<NotesViewModel>;