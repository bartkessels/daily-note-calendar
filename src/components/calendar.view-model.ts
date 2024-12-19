import {Month} from 'src/domain/models/month';
import {useDateManager} from 'src/components/providers/date-manager.context';
import React from 'react';
import {Year} from 'src/domain/models/year';
import {Day} from 'src/domain/models/day';
import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {useCalenderEnhancer} from 'src/components/providers/calendar-enhancer.context';
import {CalendarUiModel, createCalendarUiModel} from 'src/components/models/calendar.ui-model';

export interface CalendarViewModel {
    viewState: CalendarViewState;

    navigateToPreviousMonth: () => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
}

export const useCalendarViewModel = (): CalendarViewModel => {
    const dateManager = useDateManager();
    const calendarEnhancer = useCalenderEnhancer();
    const [viewState, setViewState] = React.useState<CalendarViewState>();
    const [selectedMonth, setSelectedMonth] = React.useState(dateManager?.getCurrentMonth());
    const [selectedYear, setSelectedYear] = React.useState(dateManager?.getCurrentYear());
    const [selectedDay, setSelectedDay] = React.useState(dateManager?.getCurrentDay());

    getSelectDayEvent()?.onEvent('CalendarViewModel', (day: Day): void => selectDay(day));
    getDailyNoteEvent()?.onEvent('CalendarViewModel', (day: Day): void => selectDay(day));

    const navigateToPreviousMonth = (): void => {
        const previousMonth = dateManager?.getPreviousMonth(viewState?.uiModel?.currentMonth?.month);
        selectMonth(previousMonth);
    };

    const navigateToNextMonth = (): void => {
        const nextMonth = dateManager?.getNextMonth(viewState?.uiModel?.currentMonth?.month);
        selectMonth(nextMonth);
    };

    const navigateToCurrentMonth = (): void => {
        const currentMonth = dateManager?.getCurrentMonth();
        selectMonth(currentMonth);
    };

    const selectDay = (day: Day): void => {
        updateViewState(selectedYear, selectedMonth, day).then(() => setSelectedDay(day));
    }

    const selectMonth = (month?: Month): void => {
        const year = dateManager?.getYear(month);
        updateViewState(year, month, selectedDay).then(() => {
            setSelectedMonth(month);
            setSelectedYear(year);
        });
    }

    const updateViewState = async (year?: Year, month?: Month, selectedDay?: Day): Promise<void> => {
        if (!year || !month) {
            return;
        }

        const uiModel = createCalendarUiModel(year, month, selectedDay);
        const enhancedModel = await calendarEnhancer?.withValue(uiModel).build();
        setViewState({
            ...viewState,
            uiModel: enhancedModel
        });
    };

    return <CalendarViewModel>{
        viewState: viewState,

        navigateToPreviousMonth,
        navigateToNextMonth,
        navigateToCurrentMonth
    }
};

export interface CalendarViewState {
    uiModel?: CalendarUiModel;
}