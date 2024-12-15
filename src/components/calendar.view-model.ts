import {Month} from 'src/domain/models/month';
import {useDateManager} from 'src/components/providers/date-manager.context';
import React from 'react';
import {Year} from 'src/domain/models/year';
import {createMonthUiModel, MonthUiModel} from 'src/components/month.ui-model';
import {Day} from 'src/domain/models/day';
import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {DayUiModelEnhancer} from 'src/components/enhancers/day.ui-model.enhancer';

export interface CalendarViewModel {
    viewState: CalendarViewState;

    navigateToPreviousMonth: () => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
}

export const useCalendarViewModel = (): CalendarViewModel => {
    const dateManager = useDateManager();
    const uiModelEnhancer = null;
    const [viewState, setViewState] = React.useState<CalendarViewState>();

    const selectDayEvent = getSelectDayEvent();
    const dailyNoteEvent = getDailyNoteEvent();

    React.useEffect(() => {
        rebuildUiModel(dateManager?.getCurrentMonth());
    }, [dateManager]);

    selectDayEvent?.onEvent('CalendarViewModel', (day) => selectDay(day));
    dailyNoteEvent?.onEvent('CalendarViewModel', (day) => selectDay(day));

    const selectDay = (day?: Day): void => {
        rebuildUiModel(viewState?.currentMonth?.month, day);
    }

    const navigateToPreviousMonth = (): void => {
        const previousMonth = dateManager?.getPreviousMonth(viewState?.currentMonth?.month);
        rebuildUiModel(previousMonth);
    };

    const navigateToNextMonth = (): void => {
        const nextMonth = dateManager?.getNextMonth(viewState?.currentMonth?.month);
        rebuildUiModel(nextMonth);
    };

    const navigateToCurrentMonth = (): void => {
        const currentMonth = dateManager?.getCurrentMonth();
        rebuildUiModel(currentMonth);
    };

    const rebuildUiModel = (month?: Month, selectedDay?: Day): void => {
        const currentYear = dateManager?.getYear(month);
        const monthUiModel = createMonthUiModel(month, selectedDay ?? viewState?.selectedDay);

        setViewState({
            ...viewState,
            currentYear: currentYear,
            currentMonth: monthUiModel
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
    selectedDay?: Day;
    currentYear?: Year;
    currentMonth?: MonthUiModel;
}