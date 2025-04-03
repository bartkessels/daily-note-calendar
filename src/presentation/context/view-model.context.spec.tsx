import {
    useCalendarViewModel,
    useDailyNoteViewModel,
    useMonthlyNoteViewModel, useNotesViewModel,
    useQuarterlyNoteViewModel,
    useWeeklyNoteViewModel,
    useYearlyNoteViewModel,
    ViewModelsContext
} from 'src/presentation/context/view-model.context';
import {renderHook} from '@testing-library/react';
import {mockCalendarViewModel, mockNotesViewModel, mockPeriodNoteViewModel} from 'src/test-helpers/view-model.mocks';
import {ReactNode} from 'react';
import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';

describe('ViewModelContext', () => {
    const mockViewModelsContext = {
        calendarViewModel: mockCalendarViewModel,
        dailyNoteViewModel: {...mockPeriodNoteViewModel} as PeriodNoteViewModel,
        weeklyNoteViewModel: {...mockPeriodNoteViewModel} as PeriodNoteViewModel,
        monthlyNoteViewModel: {...mockPeriodNoteViewModel} as PeriodNoteViewModel,
        quarterlyNoteViewModel: {...mockPeriodNoteViewModel} as PeriodNoteViewModel,
        yearlyNoteViewModel: {...mockPeriodNoteViewModel} as PeriodNoteViewModel,
        notesViewModel: mockNotesViewModel
    } as ViewModelsContext;

    describe('useCalendarViewModel', () => {
        it('provides the CalendarViewModel instance', () => {
            // Arrange
            const wrapper = ({children}: { children: ReactNode }) => (
                <ViewModelsContext.Provider value={mockViewModelsContext}>
                    {children}
                </ViewModelsContext.Provider>
            );

            // Act
            const { result } = renderHook(() => useCalendarViewModel(), {wrapper});

            // Assert
            expect(result.current).toBe(mockViewModelsContext.calendarViewModel);
        });

        it('returns null when no ViewModelsContext is provided', () => {
            // Act
            const { result } = renderHook(() => useCalendarViewModel());

            // Assert
            expect(result.current).toBeNull();
        });
    });

    describe('useDailyNoteViewModel', () => {
        it('provides the DailyPeriodNoteViewModel instance', () => {
            // Arrange
            const wrapper = ({children}: { children: ReactNode }) => (
                <ViewModelsContext.Provider value={mockViewModelsContext}>
                    {children}
                </ViewModelsContext.Provider>
            );

            // Act
            const { result } = renderHook(() => useDailyNoteViewModel(), {wrapper});

            // Assert
            expect(result.current).toBe(mockViewModelsContext.dailyNoteViewModel);
        });

        it('returns null when no ViewModelsContext is provided', () => {
            // Act
            const { result } = renderHook(() => useDailyNoteViewModel());

            // Assert
            expect(result.current).toBeNull();
        });
    });

    describe('useWeeklyNoteViewModel', () => {
        it('provides the WeekPeriodNoteViewModel instance', () => {
            // Arrange
            const wrapper = ({children}: { children: ReactNode }) => (
                <ViewModelsContext.Provider value={mockViewModelsContext}>
                    {children}
                </ViewModelsContext.Provider>
            );

            // Act
            const { result } = renderHook(() => useWeeklyNoteViewModel(), {wrapper});

            // Assert
            expect(result.current).toBe(mockViewModelsContext.weeklyNoteViewModel);
        });

        it('returns null when no ViewModelsContext is provided', () => {
            // Act
            const { result } = renderHook(() => useWeeklyNoteViewModel());

            // Assert
            expect(result.current).toBeNull();
        });
    });

    describe('useMonthlyNoteViewModel', () => {
        it('provides the MonthlyPeriodNoteViewModel instance', () => {
            // Arrange
            const wrapper = ({children}: { children: ReactNode }) => (
                <ViewModelsContext.Provider value={mockViewModelsContext}>
                    {children}
                </ViewModelsContext.Provider>
            );

            // Act
            const { result } = renderHook(() => useMonthlyNoteViewModel(), {wrapper});

            // Assert
            expect(result.current).toBe(mockViewModelsContext.monthlyNoteViewModel);
        });

        it('returns null when no ViewModelsContext is provided', () => {
            // Act
            const { result } = renderHook(() => useMonthlyNoteViewModel());

            // Assert
            expect(result.current).toBeNull();
        });
    });

    describe('useQuarterlyNoteViewModel', () => {
        it('provides the QuarterlyPeriodNoteViewModel instance', () => {
            // Arrange
            const wrapper = ({children}: { children: ReactNode }) => (
                <ViewModelsContext.Provider value={mockViewModelsContext}>
                    {children}
                </ViewModelsContext.Provider>
            );

            // Act
            const { result } = renderHook(() => useQuarterlyNoteViewModel(), {wrapper});

            // Assert
            expect(result.current).toBe(mockViewModelsContext.quarterlyNoteViewModel);
        });

        it('returns null when no ViewModelsContext is provided', () => {
            // Act
            const { result } = renderHook(() => useQuarterlyNoteViewModel());

            // Assert
            expect(result.current).toBeNull();
        });
    });

    describe('useYearlyNoteViewModel', () => {
        it('provides the YearlyPeriodNoteViewModel instance', () => {
            // Arrange
            const wrapper = ({children}: { children: ReactNode }) => (
                <ViewModelsContext.Provider value={mockViewModelsContext}>
                    {children}
                </ViewModelsContext.Provider>
            );

            // Act
            const { result } = renderHook(() => useYearlyNoteViewModel(), {wrapper});

            // Assert
            expect(result.current).toBe(mockViewModelsContext.yearlyNoteViewModel);
        });

        it('returns null when no ViewModelsContext is provided', () => {
            // Act
            const { result } = renderHook(() => useYearlyNoteViewModel());

            // Assert
            expect(result.current).toBeNull();
        });
    });

    describe('useNotesViewModel', () => {
        it('provides the CalendarViewModel instance', () => {
            // Arrange
            const wrapper = ({children}: { children: ReactNode }) => (
                <ViewModelsContext.Provider value={mockViewModelsContext}>
                    {children}
                </ViewModelsContext.Provider>
            );

            // Act
            const {result} = renderHook(() => useNotesViewModel(), {wrapper});

            // Assert
            expect(result.current).toBe(mockViewModelsContext.notesViewModel);
        });

        it('returns null when no ViewModelsContext is provided', () => {
            // Act
            const {result} = renderHook(() => useNotesViewModel());

            // Assert
            expect(result.current).toBeNull();
        });
    });
});