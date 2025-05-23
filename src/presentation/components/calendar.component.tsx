import React, {ReactElement} from 'react';
import {CalendarHeart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';
import {useCalendarViewModel} from 'src/presentation/context/view-model.context';
import {NotesComponent} from 'src/presentation/components/notes.component';
import {MonthlyNoteComponent} from 'src/presentation/components/month.component';
import { QuarterlyNoteComponent } from './quarter.component';
import {YearlyNoteComponent} from 'src/presentation/components/year.component';
import {WeeklyNoteComponent} from 'src/presentation/components/week.component';
import {Period} from 'src/domain/models/period.model';
import {Calendar} from 'src/domain/models/calendar.model';
import 'src/extensions/extensions';

interface CalendarComponentProperties {
    initialCalendar?: Calendar | null;
}

export const CalendarComponent = (props: CalendarComponentProperties): ReactElement => {
    const viewModel = useCalendarViewModel();
    const [calendar, setCalendar] = React.useState<Calendar | null>(props.initialCalendar ?? null);
    const [selectedPeriod, setSelectedPeriod] = React.useState<Period | null>(null);

    React.useEffect(() => {
        setCalendar(viewModel?.getCurrentWeek() ?? null);
    }, [viewModel, setCalendar]);

    if (!calendar) {
        return (<></>);
    }

    const loadNextWeek = () => setCalendar(viewModel?.getNextWeek(calendar) ?? null);
    const loadPreviousWeek = () => setCalendar(viewModel?.getPreviousWeek(calendar) ?? null);
    const loadCurrentWeek = () => setCalendar(viewModel?.getCurrentWeek() ?? null);
    const loadNextMonth = () => setCalendar(viewModel?.getNextMonth(calendar) ?? null);
    const loadPreviousMonth = () => setCalendar(viewModel?.getPreviousMonth(calendar) ?? null);

    viewModel?.initializeCallbacks(
        setSelectedPeriod,
        loadNextWeek,
        loadPreviousWeek,
        loadCurrentWeek,
        loadNextMonth,
        loadPreviousMonth
    );

    return (
        <div className="dnc">
            <div className="header">
                <span className="title">
                    <h1>
                        <MonthlyNoteComponent month={calendar.month} />
                    </h1>
                    <h1>
                        <YearlyNoteComponent year={calendar.year} />
                    </h1>
                </span>

                <div className="buttons">
                    <ChevronsLeft
                        size={18}
                        strokeWidth={1}
                        onClick={() => loadPreviousMonth()}/>
                    <ChevronLeft
                        size={18}
                        strokeWidth={1}
                        onClick={() => loadPreviousWeek()}/>
                    <CalendarHeart
                        size={18}
                        strokeWidth={1}
                        onClick={() => loadCurrentWeek()}/>
                    <ChevronRight
                        size={18}
                        strokeWidth={1}
                        onClick={() => loadNextWeek()}/>
                    <ChevronsRight
                        size={18}
                        strokeWidth={1}
                        onClick={() => loadNextMonth()}/>
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th className="quarter">
                        <QuarterlyNoteComponent quarter={calendar.quarter} />
                    </th>

                    {calendar.weekDays.map((day, index) => <th key={index}>{day}</th>)}
                </tr>
                </thead>
                <tbody>

                {calendar.weeks.map((week, weekIndex) =>
                    <WeeklyNoteComponent
                        key={weekIndex}
                        week={week}
                        days={week.days}
                        selectedPeriod={selectedPeriod}
                        today={calendar.today}
                        currentMonth={calendar.month}
                        onSelect={setSelectedPeriod} />
                )}
                </tbody>
            </table>

            <NotesComponent period={selectedPeriod}/>
        </div>
    );
}
