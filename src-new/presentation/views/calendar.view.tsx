import React, {ReactElement} from 'react';
import {useCalendarViewModel} from 'src-new/presentation/context/calendar-view-model.context';
import {CalendarUiModel} from 'src-new/presentation/models/calendar.ui-model';
import {PeriodView} from './period.view';

export const CalendarView = (): ReactElement => {
    const [uiModel, setUiModel] = React.useState<CalendarUiModel | null>(null);

    const viewModel = useCalendarViewModel();
    viewModel?.setUpdateViewState(setUiModel);

    return (
        <div className="dnc">
            <div className="header">
                <span className="title">
                    <h1><PeriodView onClick={viewModel?.openMonthlyNote} model={uiModel?.month}/></h1>&nbsp;
                    <h1><PeriodView onClick={viewModel?.openYearlyNote} model={uiModel?.year}/></h1>&nbsp;
                </span>
            </div>


            <table>
                <thead>
                    <tr>
                        <th className="quarter">
                            <PeriodView onClick={viewModel?.openQuarterlyNote} model={uiModel?.quarter}/>
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
                        <td className={week.hasPeriodNote ? 'has-note' : ''} key={week.period.name}>
                            <PeriodView onClick={viewModel?.openWeeklyNote} model={week} />
                        </td>

                        {week.days.map((day, dayIndex) =>
                            <PeriodView onClick={viewModel?.openDailyNote} model={day} />
                        )}
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}