import {Month} from 'src/domain/models/month';
import {useDateManager} from 'src/components/providers/date-manager.context';
import React from 'react';
import {Year} from 'src/domain/models/year';

export interface CalendarViewModel {
    viewState: CalendarViewState;

    navigateToPreviousMonth: () => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
}

export const useCalendarViewModel = (): CalendarViewModel => {
    const dateManager = useDateManager();
    const [viewState, setViewState] = React.useState<CalendarViewState>();

    React.useEffect(() => {
        const currentMonth = dateManager?.getCurrentMonth();
        const currentYear = dateManager?.getCurrentYear();

        setViewState({
            currentYear: currentYear,
            currentMonth: currentMonth
        });
    }, [dateManager]);

    const navigateToPreviousMonth = (): void => {
        const previousMonth = dateManager?.getPreviousMonth(viewState?.currentMonth);
        navigateToMonth(previousMonth);
    };

    const navigateToNextMonth = (): void => {
        const nextMonth = dateManager?.getNextMonth(viewState?.currentMonth);
        navigateToMonth(nextMonth);
    };

    const navigateToCurrentMonth = (): void => {
        const currentMonth = dateManager?.getCurrentMonth();
        navigateToMonth(currentMonth);
    };

    const navigateToMonth = (month?: Month): void => {
        const currentYear = dateManager?.getYear(month);

        setViewState({
            ...viewState,
            currentYear: currentYear,
            currentMonth: month
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
    currentYear?: Year;
    currentMonth?: Month;
}