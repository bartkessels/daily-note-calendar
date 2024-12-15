import * as React from 'react';
import {useCalendarViewModel} from 'src/components/calendar.view-model';
import {MonthComponent} from 'src/components/calendar/month.component';
import {HeadingComponent} from 'src/components/calendar/heading.component';
import {getQuarterlyNoteEvent} from 'src/components/providers/quarterly-note-event.context';

export const CalendarComponent = () => {
    const viewModel = useCalendarViewModel();
    const quarterlyNoteEvent = getQuarterlyNoteEvent();

    return (
        <div className="dnc">
            <HeadingComponent
                month={viewModel.viewState?.currentMonth}
                year={viewModel.viewState?.currentYear}
                navigateToPreviousMonth={viewModel.navigateToPreviousMonth}
                navigateToCurrentMonth={viewModel.navigateToCurrentMonth}
                navigateToNextMonth={viewModel.navigateToNextMonth} />

            <table>
                <thead>
                <tr>
                    <th className="quarter"
                        onClick={() => quarterlyNoteEvent?.emitEvent(viewModel.viewState?.currentMonth?.month)}>
                        Q{viewModel.viewState?.currentMonth?.month?.quarter}
                    </th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                </tr>
                </thead>
                <tbody>
                    <MonthComponent month={viewModel.viewState?.currentMonth} />
                </tbody>
            </table>
        </div>
    );
};
