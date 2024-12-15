import {Month} from 'src/domain/models/month';
import {useDateManager} from 'src/components/providers/date-manager.context';
import React from 'react';
import {Year} from 'src/domain/models/year';
import {createMonthUiModel, MonthUiModel} from 'src/components/month.ui-model';
import {Day} from 'src/domain/models/day';
import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {getCalendarUiModelEnhancer} from 'src/components/providers/calendar-ui-model-enhancer.context';
import {createCalendarUiModel} from 'src/components/calendar.ui-model';

export interface CalendarViewModel {
    viewState: CalendarViewState;

    navigateToPreviousMonth: () => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
}

export const useCalendarViewModel = (): CalendarViewModel => {
    const dateManager = useDateManager();
    const uiModelEnhancer = getCalendarUiModelEnhancer();
    const [viewState, setViewState] = React.useState<CalendarViewState>();
    const [selectedMonth, setSelectedMonth] = React.useState<Month>(dateManager?.getCurrentMonth());
    const [selectedYear, setSelectedYear] = React.useState<Year>(dateManager?.getCurrentYear());
    const [selectedDay, setSelectedDay] = React.useState<Day>(dateManager?.getCurrentDay());

    const selectDayEvent = getSelectDayEvent();
    const dailyNoteEvent = getDailyNoteEvent();

    React.useEffect(() => {
        const updateUiModel = async (): Promise<void> => {
            const uiModel = createCalendarUiModel(selectedYear, createMonthUiModel(selectedMonth, selectedDay));
            const enhancedUiModel = await uiModelEnhancer?.enhance(uiModel);

            setViewState({
                ...viewState,
                currentYear: selectedYear,
                currentMonth: enhancedUiModel?.currentMonth
            });
        }

        updateUiModel().catch(_ => {});
    }, [dateManager, uiModelEnhancer, selectedYear, selectedMonth, selectedDay]);

    selectDayEvent?.onEvent('CalendarViewModel', (day) => setSelectedDay(day));
    dailyNoteEvent?.onEvent('CalendarViewModel', (day) => setSelectedDay(day));

    const navigateToPreviousMonth = (): void => {
        const previousMonth = dateManager?.getPreviousMonth(viewState?.currentMonth?.month);
        navigateToMonth(previousMonth);
    };

    const navigateToNextMonth = (): void => {
        const nextMonth = dateManager?.getNextMonth(viewState?.currentMonth?.month);
        navigateToMonth(nextMonth);
    };

    const navigateToCurrentMonth = (): void => {
        const currentMonth = dateManager?.getCurrentMonth();
        navigateToMonth(currentMonth);
    };

    const navigateToMonth = (month?: Month): void => {
        const year = dateManager?.getYear(month);
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    return <CalendarViewModel>{
        viewState: viewState,

        navigateToPreviousMonth,
        navigateToNextMonth,
        navigateToCurrentMonth
    }
};

export interface CalendarViewState {
    selectedDay?: Day;
    currentYear?: Year;
    currentMonth?: MonthUiModel;
}