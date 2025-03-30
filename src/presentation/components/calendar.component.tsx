import React, {ReactElement} from 'react';
import {useCalendarViewModel} from 'src/presentation/context/calendar-view-model.context';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {CalendarHeart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';
import {WeekComponent} from 'src/presentation/components/week.component';
import {NotesComponent} from 'src/presentation/components/notes.component';
import 'src/extensions/extensions';

interface CalendarComponentProperties {
    initialUiModel?: CalendarUiModel | null;
}


export const CalendarComponent = (props: CalendarComponentProperties): ReactElement => {
    const [uiModel, setUiModel] = React.useState<CalendarUiModel | null>(props?.initialUiModel ?? null);
    const viewModel = useCalendarViewModel();

    viewModel?.setUpdateUiModel(setUiModel);

    return (
        <div className="dnc">
            <div className="header">
                <span className="title">
                    <h1>
                        <PeriodComponent
                            model={uiModel?.month}
                            onClick={(key, period) => viewModel?.openMonthlyNote(key, period)}
                            onDelete={(period) => viewModel?.deleteMonthlyNote(period)}
                        />
                    </h1>
                    <h1>
                        <PeriodComponent
                            model={uiModel?.year}
                            onClick={(key, period) => viewModel?.openYearlyNote(key, period)}
                            onDelete={(period) => viewModel?.deleteYearlyNote(period)}
                        />
                    </h1>
                </span>

                <div className="buttons">
                    <ChevronsLeft
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel?.loadPreviousMonth()}/>
                    <ChevronLeft
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel?.loadPreviousWeek()}/>
                    <CalendarHeart
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel?.loadCurrentWeek()}/>
                    <ChevronRight
                        size={18}
                        strokeWidth={1}
                        onClick={() => {
                            viewModel?.loadNextWeek()
                        }}/>
                    <ChevronsRight
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel?.loadNextMonth()}/>
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th className="quarter">
                        <PeriodComponent
                            model={uiModel?.quarter}
                            isSelected={false}
                            onClick={(key, period) => viewModel?.openQuarterlyNote(key, period)}
                            onDelete={(period) => viewModel?.deleteQuarterlyNote(period)}
                        />
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
                    <WeekComponent
                        key={weekIndex}
                        model={week}
                        currentMonth={uiModel?.month}
                        selectedPeriod={uiModel?.selectedPeriod}
                        currentPeriod={uiModel?.today}
                        onWeekClick={(key, week) => viewModel?.openWeeklyNote(key, week)}
                        onDeleteWeekClick={(week) => viewModel?.deleteWeeklyNote(week)}
                        onDayClick={(key, day) => viewModel?.openDailyNote(key, day)}
                        onDeleteDayClick={(day) => viewModel?.deleteDailyNote(day)}
                    />
                )}
                </tbody>
            </table>

            <NotesComponent period={uiModel?.selectedPeriod}/>
        </div>
    );
}
