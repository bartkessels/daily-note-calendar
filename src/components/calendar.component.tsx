import * as React from 'react';
import {useCalendarViewModel} from 'src/components/calendar.view-model';
import {useDayViewModel} from 'src/components/calendar/day.view-model';
import {useWeekViewModel} from 'src/components/calendar/week.view-model';
import {MonthComponent} from 'src/components/calendar/month.component';
import {useHeadingViewModel} from 'src/components/calendar/heading.view-model';
import {HeadingComponent} from 'src/components/calendar/heading.component';

export const CalendarComponent = () => {
    const viewModel = useCalendarViewModel();
    const dayViewModel = useDayViewModel();
    const weekViewModel = useWeekViewModel();
    const headingViewModel = useHeadingViewModel();

    return (
        <div className="dnc">
            <HeadingComponent
                month={viewModel.viewState?.currentMonth}
                year={viewModel.viewState?.currentYear}
                viewModel={headingViewModel}
                navigateToPreviousMonth={viewModel.navigateToPreviousMonth}
                navigateToCurrentMonth={viewModel.navigateToCurrentMonth}
                navigateToNextMonth={viewModel.navigateToNextMonth} />

            <table>
                <thead>
                <tr>
                    <th className="quarter"
                        onClick={() => viewModel.openQuarterlyNote(viewModel.viewState?.currentMonth)}>
                        Q{viewModel.viewState?.currentMonth?.quarter}
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
                    <MonthComponent
                        month={viewModel.viewState?.currentMonth}
                        weekViewModel={weekViewModel}
                        dayViewModel={dayViewModel} />
                </tbody>
            </table>
        </div>
    );
};
