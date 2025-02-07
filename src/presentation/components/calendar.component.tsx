import React, {ReactElement} from 'react';
import {useCalendarViewModel} from 'src/presentation/context/calendar-view-model.context';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {PeriodComponent} from 'src/presentation/components/period.component';

export const CalendarComponent = (): ReactElement => {
    const [uiModel, setUiModel] = React.useState<CalendarUiModel | null>(null);

    const viewModel = useCalendarViewModel();
    viewModel?.setUpdateViewState(setUiModel);

    return (
        <div className="dnc" onScroll={(e) => {
            viewModel?.loadNextWeek();
            console.log('Scrolling');
            // e.preventDefault();
        }}>
            <div className="header">
                <span className="title">
                    <h1><PeriodComponent onClick={viewModel?.openMonthlyNote} model={uiModel?.month}/></h1>&nbsp;
                    <h1><PeriodComponent onClick={viewModel?.openYearlyNote} model={uiModel?.year}/></h1>&nbsp;
                </span>
            </div>


            <table onScroll={(e) => console.log('Hoi scroll')}>
                <thead>
                    <tr>
                        <th className="quarter">
                            <PeriodComponent onClick={viewModel?.openQuarterlyNote} model={uiModel?.quarter}/>
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
                {uiModel?.weeks.map((week, weekIndex) =>
                    <tr key={weekIndex}>
                        <td className={week.hasPeriodNote ? 'has-note weekNumber' : 'weekNumber'} key={weekIndex}>
                            <PeriodComponent onClick={(key, period) => viewModel?.openWeeklyNote(key, period)} model={week} />
                        </td>

                        {week.days.map((day, dayIndex) =>
                            <td key={dayIndex} className={!day.period.date.isSameMonth(uiModel?.month?.period) ? 'other-month' : ''}>
                                <PeriodComponent onClick={viewModel?.openDailyNote} model={day} />
                            </td>
                        )}
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}