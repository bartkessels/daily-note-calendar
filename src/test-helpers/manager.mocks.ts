import {NoteManager} from 'src/business/contracts/note.manager';
import {DateManager} from 'src/business/contracts/date.manager';
import {jest} from '@jest/globals';
import {PeriodicNoteManager} from 'src/business/contracts/periodic-note.manager';

export const mockNoteManager = {
    getActiveNote: jest.fn(),
    getNotesForPeriod: jest.fn(),
    openNote: jest.fn(),
    deleteNote: jest.fn()
} as jest.Mocked<NoteManager>;

export const mockDateManager = {
    getCurrentDay: jest.fn(),
    getTomorrow: jest.fn(),
    getYesterday: jest.fn(),
    getCurrentWeek: jest.fn(),
    getWeek: jest.fn(),
    getPreviousWeeks: jest.fn(),
    getNextWeeks: jest.fn(),
    getNextMonth: jest.fn(),
    getPreviousMonth: jest.fn(),
    getQuarter: jest.fn()
} as jest.Mocked<DateManager>;

export const mockPeriodicNoteManager = {
    doesNoteExist: jest.fn(),
    createNote: jest.fn(),
    openNote: jest.fn(),
    deleteNote: jest.fn()
} as jest.Mocked<PeriodicNoteManager>;