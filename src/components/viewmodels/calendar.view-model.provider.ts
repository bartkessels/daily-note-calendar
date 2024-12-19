import {useDateManager} from 'src/components/providers/date-manager.context';
import {useCalenderEnhancer} from 'src/components/providers/calendar-enhancer.context';
import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import React from 'react';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {CalendarViewModel, DefaultCalendarViewModel} from 'src/components/viewmodels/calendar.view-model';
import {CalendarViewState} from 'src/components/viewmodels/calendar.view-state';

export const useCalendarViewModel = (): CalendarViewModel | undefined => {
    const dateManager = useDateManager();
    const calendarEnhancer = useCalenderEnhancer();
    const selectDayEvent = getSelectDayEvent();
    const dailyNoteEvent = getDailyNoteEvent();

    const [viewState, setViewState] = React.useState<CalendarViewState>();
    const [viewModel, setViewModel] = React.useState<DefaultCalendarViewModel>();

    React.useEffect(() => {
        const viewModel = new DefaultCalendarViewModel(
            (uiModel: CalendarUiModel): void => setViewState({...viewState, uiModel: uiModel}),
            selectDayEvent,
            dailyNoteEvent,
            dateManager,
            calendarEnhancer
        );
        setViewModel(viewModel);
    }, [dateManager, calendarEnhancer, selectDayEvent, dailyNoteEvent]);

    return viewModel?.withViewState(viewState);
};
