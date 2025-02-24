import React, {ReactElement} from 'react';
import {useCalendarViewModel} from 'src/presentation/context/calendar-view-model.context';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {CalendarHeart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';
import {arePeriodUiModelsEqual} from 'src/presentation/models/period.ui-model';
import 'src/extensions/extensions';
import Skeleton from 'react-loading-skeleton';

interface CalendarComponentProperties {
    initialUiModel?: CalendarUiModel | null;
}


export const CalendarComponent = (
    {
        initialUiModel = null
    }: CalendarComponentProperties
): ReactElement => {
    const [uiModel, setUiModel] = React.useState<CalendarUiModel | null>(initialUiModel);

    const viewModel = useCalendarViewModel();
    // viewModel?.setUpdateViewState(setUiModel);

    return (
        <div className="dnc">
            <div className="header">
            <span className="title">

                {(() => {
                    if (!uiModel) {
                        return <Skeleton width="50%"/>
                    }

                    return (<>
                        <h1><PeriodComponent onClick={(key, period) => viewModel?.openMonthlyNote(key, period)} model={uiModel?.month}/></h1>&nbsp;
                        <h1><PeriodComponent onClick={(key, period) => viewModel?.openYearlyNote(key, period)} model={uiModel?.year}/></h1>&nbsp;
                    </>)
                })()}
                </span>

                <div className="buttons">
                    <ChevronsLeft
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel?.loadPreviousMonth()} />
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
                    <ChevronsRight
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel?.loadNextMonth()} />
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
                                isSelected={arePeriodUiModelsEqual(uiModel?.selectedPeriod, week)}
                                onClick={(key, period) => viewModel?.openWeeklyNote(key, period)}
                                model={week} />
                        </td>

                        {week.days.map((day, dayIndex) =>
                            <td height="35" key={dayIndex} className={!day.period.date.isSameMonth(uiModel?.month?.period) ? 'other-month' : ''}>
                                <PeriodComponent
                                    isToday={arePeriodUiModelsEqual(uiModel?.today, day)}
                                    isSelected={arePeriodUiModelsEqual(uiModel?.selectedPeriod, day)}
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