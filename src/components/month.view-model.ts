import {Month} from 'src/domain/models/month';
import {getMonthlyNoteEvent} from 'src/components/providers/monthly-note-event.context';
import {useDateManager} from 'src/components/providers/date-manager.context';
import React from 'react';

export interface MonthViewModel {
    viewState: MonthViewState;
    init: () => void;
    openMonthlyNote: (month?: Month) => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
    navigateToPreviousMonth: () => void;
}

export const useMonthViewModel = (): MonthViewModel => {
    const [viewState, setViewState] = React.useState<MonthViewState>();

    const dateManager = useDateManager();
    const monthlyNoteEvent = getMonthlyNoteEvent();


    const init = (): void => React.useEffect(() => {
        const currentMonth = dateManager?.getCurrentMonth();

        if (!currentMonth) {
            return;
        }

        setViewState({
            currentMonth: currentMonth
        });

        console.log('month viewmodel has been initted');
    }, [dateManager]);

    const openMonthlyNote = (month?: Month): void => monthlyNoteEvent?.emitEvent(month);

    const navigateToNextMonth = (): void => updateMonth(dateManager?.getNextMonth(viewState?.currentMonth));
    const navigateToPreviousMonth = (): void => updateMonth(dateManager?.getPreviousMonth(viewState?.currentMonth));
    const navigateToCurrentMonth = (): void => updateMonth(dateManager?.getCurrentMonth());

    const updateMonth = (month?: Month): void => {
        if (!month) {
            return;
        }

        setViewState({
            currentMonth: month
        });
    };

    return <MonthViewModel> {
        viewState,
        init,
        openMonthlyNote,
        navigateToNextMonth,
        navigateToCurrentMonth,
        navigateToPreviousMonth
    };
};

export interface MonthViewState {
    currentMonth: Month;
}