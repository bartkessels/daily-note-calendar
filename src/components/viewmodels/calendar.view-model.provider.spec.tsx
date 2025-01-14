import {DateManagerContext} from 'src/components/context/date-manager.context';
import {CalendarEnhancerContext} from 'src/components/context/calendar-enhancer.context';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {DateManager} from 'src/domain/managers/date.manager';
import {Enhancer} from 'src/domain/enhancers/enhancer';
import React from 'react';
import {renderHook, waitFor} from '@testing-library/react';
import {useCalendarViewModel} from 'src/components/viewmodels/calendar.view-model.provider';
import {DefaultCalendarViewModel} from 'src/components/viewmodels/calendar.view-model';
import 'src/extensions/extensions';
import {PeriodicNoteEventContext} from 'src/components/context/periodic-note-event.context';
import {ManageEvent} from 'src/domain/events/manage.event';
import {PeriodicManageEvent} from 'src/implementation/events/periodic.manage-event';

describe('useCalendarViewModel', () => {
    let currentDay: Day;
    let currentWeek: Week;
    let currentMonth: Month;
    let currentYear: Year;

    const mockDateManager = {
        getCurrentMonth: jest.fn(),
        getCurrentYear: jest.fn(),
        getCurrentDay: jest.fn(),
        getMonth: jest.fn(),
        getPreviousMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getYear: jest.fn()
    } as jest.Mocked<DateManager>;

    const mockEnhancer = {
        withValue: jest.fn(),
        withStep: jest.fn(),
        build: jest.fn()
    } as unknown as jest.Mocked<Enhancer<CalendarUiModel>>;

    let dailyNoteEvent: ManageEvent<Day>;

    beforeEach(() => {
        currentDay = {date: new Date(2023, 9, 1), dayOfWeek: DayOfWeek.Sunday, name: '1'};
        currentWeek = {
            date: new Date(2023, 9, 1),
            weekNumber: '40',
            days: [
                currentDay,
                {dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2'},
                {dayOfWeek: 2, date: new Date(2023, 9, 3), name: '3'},
                {dayOfWeek: 3, date: new Date(2023, 9, 4), name: '4'},
                {dayOfWeek: 4, date: new Date(2023, 9, 5), name: '5'},
                {dayOfWeek: 5, date: new Date(2023, 9, 6), name: '6'},
                {dayOfWeek: 6, date: new Date(2023, 9, 7), name: '7'},
            ]
        };
        currentMonth = {
            date: new Date(2023, 9),
            name: 'October',
            quarter: {
                date: new Date(2023, 6),
                quarter: 3,
                year: 2023
            },
            weeks: [currentWeek]
        };
        currentYear = {
            date: new Date(2024, 0),
            name: '2024'
        };

        mockDateManager.getCurrentDay.mockReturnValue(currentDay);
        mockDateManager.getCurrentMonth.mockResolvedValue(currentMonth);
        mockDateManager.getCurrentYear.mockResolvedValue(currentYear);
        mockEnhancer.withValue.mockReturnValue(mockEnhancer);

        dailyNoteEvent = new PeriodicManageEvent<Day>();
    });

    const setup = () => {
        return renderHook(() => useCalendarViewModel(), {
            wrapper: ({children}: { children: React.ReactNode }) => (
                <DateManagerContext.Provider value={mockDateManager}>
                    <CalendarEnhancerContext.Provider value={mockEnhancer}>
                        <PeriodicNoteEventContext value={{manageDayEvent: dailyNoteEvent}}>
                            {children}
                        </PeriodicNoteEventContext>
                    </CalendarEnhancerContext.Provider>
                </DateManagerContext.Provider>
            )
        });
    };

    it('should only call the initialize of the view model once', async () => {
        const viewModelInitializeSpy = jest.spyOn(DefaultCalendarViewModel.prototype, 'initialize');
        setup();

        await waitFor(() => {
            expect(viewModelInitializeSpy).toHaveBeenCalledTimes(1);
        });
    });

    it('should call setViewState when the view state is updated', async () => {
        const setViewStateSpy = jest.spyOn(React, 'useState');
        const setViewState = jest.fn();
        setViewStateSpy.mockReturnValue([undefined, setViewState]);

        setup();

        await waitFor(() => {
            expect(setViewState).toHaveBeenCalled();
        });
    });
});