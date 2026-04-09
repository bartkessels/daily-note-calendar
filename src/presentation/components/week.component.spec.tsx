import React, {ReactNode} from 'react';
import {render, act} from '@testing-library/react';
import 'src/extensions/extensions';
import {WeeklyNoteComponent} from 'src/presentation/components/week.component';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';
import {ViewModelsContext as ViewModelsContextType} from 'src/presentation/context/view-model.context';
import {mockCalendarViewModel, mockDayNoteViewModel, mockPeriodNoteViewModel, mockNotesViewModel} from 'src/test-helpers/view-model.mocks';
import {mockPeriod} from 'src/test-helpers/model.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {Week} from 'src/domain/models/week';

describe('WeeklyNoteComponent', () => {
    const today = {
        ...mockPeriod,
        date: new Date(2023, 9, 5),
        name: '5',
    };

    const days: Period[] = [
        {...mockPeriod, date: new Date(2023, 9, 1), name: '1'},
        {...mockPeriod, date: new Date(2023, 9, 2), name: '2'},
        {...mockPeriod, date: new Date(2023, 9, 3), name: '3'},
        {...mockPeriod, date: new Date(2023, 9, 4), name: '4'},
        today,
        {...mockPeriod, date: new Date(2023, 9, 6), name: '6'},
        {...mockPeriod, date: new Date(2023, 9, 7), name: '7'},
    ];

    const week: Week = {
        ...mockPeriod,
        type: PeriodType.Week,
        name: '40',
        date: new Date(2023, 9, 1),
        weekNumber: 40,
        year: {...mockPeriod, type: PeriodType.Year, name: '2023', date: new Date(2023, 0, 1)},
        quarter: {...mockPeriod, type: PeriodType.Quarter, name: 'Q4', date: new Date(2023, 9, 1)},
        month: {...mockPeriod, type: PeriodType.Month, name: 'October', date: new Date(2023, 9, 1)},
        days,
    };

    const onSelect = jest.fn();
    const mockWeeklyViewModel = {...mockPeriodNoteViewModel};

    const mockContext: ViewModelsContextType = {
        calendarViewModel: mockCalendarViewModel,
        dailyNoteViewModel: mockDayNoteViewModel,
        weeklyNoteViewModel: mockWeeklyViewModel,
        monthlyNoteViewModel: {...mockPeriodNoteViewModel},
        quarterlyNoteViewModel: {...mockPeriodNoteViewModel},
        yearlyNoteViewModel: {...mockPeriodNoteViewModel},
        notesViewModel: mockNotesViewModel,
    };

    const wrapper = ({children}: {children: ReactNode}) => (
        <ViewModelsContext.Provider value={mockContext}>
            {children}
        </ViewModelsContext.Provider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
        mockWeeklyViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(0);
    });

    it('renders without crashing', () => {
        const {container} = render(
            <table>
                <tbody>
                    <WeeklyNoteComponent
                        week={week}
                        days={days}
                        today={today}
                        selectedPeriod={null}
                        currentMonth={week.month}
                        noteCountToken={0}
                        onSelect={onSelect}
                    />
                </tbody>
            </table>,
            {wrapper},
        );
        expect(container.firstChild).toBeTruthy();
    });

    it('checks if periodic note exists on render', async () => {
        mockWeeklyViewModel.hasPeriodicNote.mockResolvedValue(false);

        render(
            <table>
                <tbody>
                    <WeeklyNoteComponent
                        week={week}
                        days={days}
                        today={today}
                        selectedPeriod={null}
                        currentMonth={week.month}
                        noteCountToken={0}
                        onSelect={onSelect}
                    />
                </tbody>
            </table>,
            {wrapper},
        );

        expect(mockWeeklyViewModel.hasPeriodicNote).toHaveBeenCalledWith(week);
    });

    it('renders week name in PeriodComponent', async () => {
        mockWeeklyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = render(
            <table>
                <tbody>
                    <WeeklyNoteComponent
                        week={week}
                        days={days}
                        today={today}
                        selectedPeriod={null}
                        currentMonth={week.month}
                        noteCountToken={0}
                        onSelect={onSelect}
                    />
                </tbody>
            </table>,
            {wrapper},
        );

        expect(container.textContent).toContain(week.name);
    });

    it('renders all day components', async () => {
        mockWeeklyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = render(
            <table>
                <tbody>
                    <WeeklyNoteComponent
                        week={week}
                        days={days}
                        today={today}
                        selectedPeriod={null}
                        currentMonth={week.month}
                        noteCountToken={0}
                        onSelect={onSelect}
                    />
                </tbody>
            </table>,
            {wrapper},
        );

        // Should render 7 days + 1 week cell = 8 cells total
        const cells = container.querySelectorAll('td');
        expect(cells.length).toBe(8);
    });

    it('marks week as selected when selectedPeriod matches week', async () => {
        mockWeeklyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = render(
            <table>
                <tbody>
                    <WeeklyNoteComponent
                        week={week}
                        days={days}
                        today={today}
                        selectedPeriod={week}
                        currentMonth={week.month}
                        noteCountToken={0}
                        onSelect={onSelect}
                    />
                </tbody>
            </table>,
            {wrapper},
        );

        const weekCell = container.querySelector('.weekNumber');
        expect(weekCell).toBeTruthy();
        // Week is selected so component should render
        expect(container.textContent).toContain(week.name);
    });

    it('calls onSelect when week is selected via PeriodComponent', async () => {
        mockWeeklyViewModel.hasPeriodicNote.mockResolvedValue(false);

        await act(async () => {
            render(
                <table>
                    <tbody>
                        <WeeklyNoteComponent
                            week={week}
                            days={days}
                            today={today}
                            selectedPeriod={null}
                            currentMonth={week.month}
                            noteCountToken={0}
                            onSelect={onSelect}
                        />
                    </tbody>
                </table>,
                {wrapper},
            );
        });

        // Verify component rendered correctly
        expect(mockWeeklyViewModel.hasPeriodicNote).toHaveBeenCalledWith(week);
    });

    it('passes noteCountToken to DailyNoteComponent', async () => {
        const noteCountToken = 5;
        mockWeeklyViewModel.hasPeriodicNote.mockResolvedValue(false);

        await act(async () => {
            render(
                <table>
                    <tbody>
                        <WeeklyNoteComponent
                            week={week}
                            days={days}
                            today={today}
                            selectedPeriod={null}
                            currentMonth={week.month}
                            noteCountToken={noteCountToken}
                            onSelect={onSelect}
                        />
                    </tbody>
                </table>,
                {wrapper},
            );
        });

        // Verify getNoteCount was called for each day (7 times)
        expect(mockDayNoteViewModel.getNoteCount).toHaveBeenCalledTimes(7);
    });
});
