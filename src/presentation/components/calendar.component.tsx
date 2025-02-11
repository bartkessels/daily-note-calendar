import React, {ReactElement, useCallback, useRef} from 'react';
import {useCalendarViewModel} from 'src/presentation/context/calendar-view-model.context';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {CalendarHeart, ChevronLeft, ChevronRight} from 'lucide-react';
import {arePeriodsEqual} from 'src/presentation/models/period.ui-model';

export const CalendarComponent = (): ReactElement => {
    const [uiModel, setUiModel] = React.useState<CalendarUiModel | null>(null);

    const viewModel = useCalendarViewModel();
    viewModel?.setUpdateViewState(setUiModel);

    return (
        <div className="dnc">
            <div className="header">
                <span className="title">
                    <h1><PeriodComponent onClick={(key, period) => viewModel?.openMonthlyNote(key, period)} model={uiModel?.month}/></h1>&nbsp;
                    <h1><PeriodComponent onClick={(key, period) => viewModel?.openYearlyNote(key, period)} model={uiModel?.year}/></h1>&nbsp;
                </span>

                <div className="buttons">
                    <ChevronLeft
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel?.loadPreviousWeek()} />
                    <CalendarHeart
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel?.loadCurrentWeek()} />
                    <ChevronRight
                        size={18}
                        strokeWidth={1}
                        onClick={() => {viewModel?.loadNextWeek()}} />
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th className="quarter">
                            <PeriodComponent
                                isSelected={false}
                                onClick={(key, period) => viewModel?.openQuarterlyNote(key, period)}
                                model={uiModel?.quarter} />
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
                        <td height="35" className="weekNumber" key={weekIndex}>
                            <PeriodComponent
                                isSelected={arePeriodsEqual(uiModel?.selectedPeriod, week)}
                                onClick={(key, period) => viewModel?.openWeeklyNote(key, period)}
                                model={week} />
                        </td>

                        {week.days.map((day, dayIndex) =>
                            <td height="35" key={dayIndex} className={!day.period.date.isSameMonth(uiModel?.month?.period) ? 'other-month' : ''}>
                                <PeriodComponent
                                    isToday={arePeriodsEqual(uiModel?.today, day)}
                                    isSelected={arePeriodsEqual(uiModel?.selectedPeriod, day)}
                                    onClick={(key, period) => viewModel?.openDailyNote(key, period)}
                                    model={day} />
                            </td>
                        )}
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}