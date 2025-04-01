import {createContext, useContext} from 'react';
import {DayPeriodNoteViewModel} from 'src/presentation/view-models/day.period-note-view-model';
import {WeekPeriodNoteViewModel} from 'src/presentation/view-models/week.period-note-view-model';
import {MonthPeriodNoteViewModel} from 'src/presentation/view-models/month.period-note-view-model';
import {QuarterPeriodNoteViewModel} from 'src/presentation/view-models/quarter.period-note-view-model';
import {YearPeriodNoteViewModel} from 'src/presentation/view-models/year.period-note-view-model';

export interface ViewModelsContext {
    dailyNoteViewModel: DayPeriodNoteViewModel;
    weeklyNoteViewModel: WeekPeriodNoteViewModel;
    monthlyNoteViewModel: MonthPeriodNoteViewModel;
    quarterlyNoteViewModel: QuarterPeriodNoteViewModel;
    yearlyNoteViewModel: YearPeriodNoteViewModel;
}

export const ViewModelsContext = createContext<ViewModelsContext | null>(null);

export const useDailyNoteViewModel = (): DayPeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.dailyNoteViewModel ?? null;

export const useWeeklyNoteViewModel = (): WeekPeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.weeklyNoteViewModel ?? null;

export const useMonthlyNoteViewModel = (): MonthPeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.monthlyNoteViewModel ?? null;

export const useQuarterlyNoteViewModel = (): QuarterPeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.quarterlyNoteViewModel ?? null;

export const useYearlyNoteViewModel = (): YearPeriodNoteViewModel | null =>
    useContext(ViewModelsContext)?.yearlyNoteViewModel ?? null;
