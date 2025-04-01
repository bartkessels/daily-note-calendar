import React, {ReactElement} from 'react';
import {useCalendarViewModel} from 'src/presentation/context/calendar-view-model.context';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {CalendarHeart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';
import {NotesComponent} from 'src/presentation/components/notes.component';
import {MonthlyNoteComponent} from 'src/presentation/components/month.component';
import { QuarterlyNoteComponent } from './quarter.component';
import {YearlyNoteComponent} from 'src/presentation/components/year.component';
import {WeeklyNoteComponent} from 'src/presentation/components/week.component';
import {Period} from 'src/domain/models/period.model';
import 'src/extensions/extensions';

interface CalendarComponentProperties {
    initialUiModel?: CalendarUiModel | null;
}


export const CalendarComponent = (props: CalendarComponentProperties): ReactElement => {
    const [uiModel, setUiModel] = React.useState<CalendarUiModel | null>(props?.initialUiModel ?? null);
    const [selectedPeriod, setSelectedPeriod] = React.useState<Period | null>(null);
    const viewModel = useCalendarViewModel();

    React.useEffect(() => {
        viewModel?.setUpdateUiModel(setUiModel);
        viewModel?.loadCurrentWeek();
    }, [viewModel, setUiModel]);

    if (!uiModel) {
        console.log(uiModel);
        return (<></>);
    }

    return (
        <div className="dnc">
            <div className="header">
                <span className="title">
                    <h1>
                        <MonthlyNoteComponent month={uiModel.month} />
                    </h1>
                    <h1>
                        <YearlyNoteComponent year={uiModel.year} />
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
                        <QuarterlyNoteComponent quarter={uiModel.quarter} />
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
                    <WeeklyNoteComponent
                        week={week}
                        days={week.days}
                        selectedPeriod={selectedPeriod}
                        today={uiModel?.today}
                        onSelect={(period) => setSelectedPeriod(period)} />
                )}
                </tbody>
            </table>

            <NotesComponent period={selectedPeriod}/>
        </div>
    );
}
