import * as React from 'react';
import {MonthComponent} from 'src-old/components/calendar/month.component';
import {HeadingComponent} from 'src-old/components/calendar/heading.component';
import {useCalendarViewModel} from 'src-old/components/viewmodels/calendar.view-model.provider';
import {ManageAction} from 'src-old/domain/events/manage.event';
import {getManageQuarterEvent} from 'src-old/components/context/periodic-note-event.context';

export const CalendarComponent = () => {
    const viewModel = useCalendarViewModel();
    const manageQuarterEvent = getManageQuarterEvent();
    const uiModel = viewModel?.viewState?.uiModel;

    return (
        <div className="dnc">
            <HeadingComponent
                month={uiModel?.currentMonth}
                year={uiModel?.currentYear}
                navigateToPreviousMonth={viewModel?.navigateToPreviousMonth}
                navigateToCurrentMonth={viewModel?.navigateToCurrentMonth}
                navigateToNextMonth={viewModel?.navigateToNextMonth} />

            <table>
                <thead>
                <tr>
                    <th className="quarter"
                        onClick={() => manageQuarterEvent?.emitEvent(ManageAction.Open, uiModel?.currentMonth?.month?.quarter)}>
                        Q{uiModel?.currentMonth?.month?.quarter?.quarter}
                    </th>
                    {!uiModel?.startWeekOnMonday && <th>Sun</th>}
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    {uiModel?.startWeekOnMonday && <th>Sun</th>}
                </tr>
                </thead>
                <tbody>
                    <MonthComponent month={uiModel?.currentMonth} />
                </tbody>
            </table>
        </div>
    );
};
