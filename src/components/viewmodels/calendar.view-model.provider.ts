import {useDateManager} from 'src/components/context/date-manager.context';
import {useCalenderEnhancer} from 'src/components/context/calendar-enhancer.context';
import React from 'react';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {CalendarViewModel, DefaultCalendarViewModel} from 'src/components/viewmodels/calendar.view-model';
import {CalendarViewState} from 'src/components/viewmodels/calendar.view-state';
import {getManageDayEvent} from 'src/components/context/periodic-note-event.context';

export const useCalendarViewModel = (): CalendarViewModel | undefined => {
    const dateManager = useDateManager();
    const calendarEnhancer = useCalenderEnhancer();
    const manageDayEvent = getManageDayEvent();

    const [viewState, setViewState] = React.useState<CalendarViewState>();
    const [viewModel, setViewModel] = React.useState<DefaultCalendarViewModel>();

    React.useEffect(() => {
        const viewModel = new DefaultCalendarViewModel(
            (uiModel: CalendarUiModel): void => setViewState({...viewState, uiModel: uiModel}),
            manageDayEvent,
            dateManager,
            calendarEnhancer
        );
        setViewModel(viewModel);

        viewModel.initialize().then();
    }, [dateManager, calendarEnhancer, manageDayEvent]);

    return viewModel?.withViewState(viewState);
};
