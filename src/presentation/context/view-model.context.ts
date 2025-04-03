import {createContext, useContext} from 'react';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';
import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import { NotesViewModel } from 'src/presentation/contracts/notes.view-model';

export interface ViewModelsContext {
    calendarViewModel: CalendarViewModel;
    dailyNoteViewModel: PeriodNoteViewModel;
    weeklyNoteViewModel: PeriodNoteViewModel;
    monthlyNoteViewModel: PeriodNoteViewModel;
    quarterlyNoteViewModel: PeriodNoteViewModel;
    yearlyNoteViewModel: PeriodNoteViewModel;
    notesViewModel: NotesViewModel;
}

export const ViewModelsContext = createContext<ViewModelsContext | null>(null);

export const useCalendarViewModel = (): CalendarViewModel | null =>
    useContext(ViewModelsContext)?.calendarViewModel ?? null;

export const useDailyNoteViewModel = (): PeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.dailyNoteViewModel ?? null;

export const useWeeklyNoteViewModel = (): PeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.weeklyNoteViewModel ?? null;

export const useMonthlyNoteViewModel = (): PeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.monthlyNoteViewModel ?? null;

export const useQuarterlyNoteViewModel = (): PeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.quarterlyNoteViewModel ?? null;

export const useYearlyNoteViewModel = (): PeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.yearlyNoteViewModel ?? null;

export const useNotesViewModel = (): NotesViewModel | null =>
    useContext(ViewModelsContext)?.notesViewModel ?? null;