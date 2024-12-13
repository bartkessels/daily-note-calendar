import {Day, dayEquals} from 'src/domain/models/day';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {useDateManager} from 'src/components/providers/date-manager.context';
import React from 'react';
import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';

export interface DayViewModel {
    openDailyNote: (day?: Day) => void;
    isToday: (day?: Day) => boolean;
    isSelected: (day?: Day) => boolean;
}

export const useDayViewModel = (): DayViewModel => {
    const dateManager = useDateManager();
    const [viewState, setViewState] = React.useState<DayViewState>();

    const selectDayEvent = getSelectDayEvent();
    const dailyNoteEvent = getDailyNoteEvent();

    selectDayEvent?.onEvent('DayViewModel', (day) => selectDay(day));
    dailyNoteEvent?.onEvent('DayViewModel', (day) => selectDay(day));

    React.useEffect(() => {
        const today = dateManager?.getCurrentDay();

        setViewState({
            today: today
        });
    }, [dateManager]);

    const openDailyNote = (day?: Day): void => dailyNoteEvent?.emitEvent(day);

    const selectDay = (day?: Day): void => {
        if (!viewState || !day) {
            return;
        }

        setViewState({
            ...viewState,
            selectedDay: day
        });
    };

    const isToday = (day?: Day): boolean => {
        return day?.date?.isToday();
    };

    const isSelected = (day?: Day): boolean => {
        return dayEquals(day, viewState?.selectedDay);
    }

    return <DayViewModel> {
        openDailyNote,
        isToday,
        isSelected
    };
};

export interface DayViewState {
    selectedDay?: Day;
    today?: Day;
}