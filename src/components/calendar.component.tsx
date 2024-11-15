import {CalendarHeart, ChevronLeft, ChevronRight, Dot} from 'lucide-react';
import * as React from 'react';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {useDateManager} from 'src/components/providers/datemanager.provider';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {getWeeklyNoteEvent} from 'src/components/providers/weekly-note-event.context';
import {getMonthlyNoteEvent} from 'src/components/providers/monthly-note-event.context';
import {getYearlyNoteEvent} from 'src/components/providers/yearly-note-event.provider';
import {Month} from 'src/domain/models/month';
import {getQuarterlyNoteEvent} from 'src/components/providers/quarterly-note-event.context';

const WEEK_DAYS_ORDER = [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
    DayOfWeek.Sunday
];

export const CalendarComponent = () => {
    const dateManager = useDateManager();
    const [selectedDay, setSelectedDay] = React.useState<Day>();
    const [currentYear, setCurrentYear] = React.useState(dateManager?.getCurrentYear());
    const [currentMonth, setCurrentMonth] = React.useState(dateManager?.getCurrentMonth());

    const dailyNoteEvent = getDailyNoteEvent();
    const weeklyNoteEvent = getWeeklyNoteEvent();
    const monthlyNoteEvent = getMonthlyNoteEvent();
    const quarterlyNoteEvent = getQuarterlyNoteEvent();
    const yearlyNoteEvent = getYearlyNoteEvent();

    const updateMonth = (getMonth: () => Month | undefined): void => {
        setCurrentMonth(getMonth());
        setCurrentYear(dateManager?.getYear(currentMonth));
    };

    const selectDay = (day?: Day) => {
        setSelectedDay(day);
        dailyNoteEvent?.emitEvent(day);
    };

    const goToCurrentMonth = () => updateMonth(() => dateManager?.getCurrentMonth());
    const goToPreviousMonth = () => updateMonth(() => dateManager?.getPreviousMonth(currentMonth));
    const goToNextMonth = () => updateMonth(() => dateManager?.getNextMonth(currentMonth));

    return (
        <>
            <div className="header">
                <span className="title">
                    <h1 onClick={() => monthlyNoteEvent?.emitEvent(currentMonth)}>{currentMonth?.name}</h1>&nbsp;
                    <h1 onClick={() => yearlyNoteEvent?.emitEvent(currentYear)}>{currentYear?.name}</h1>&nbsp;
                </span>

                <div className="buttons">
                    <ChevronLeft
                        strokeWidth={1}
                        onClick={goToPreviousMonth} />
                    <CalendarHeart
                        strokeWidth={1}
                        onClick={goToCurrentMonth} />
                    <ChevronRight
                        strokeWidth={1}
                        onClick={goToNextMonth} />
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th className="quarter" onClick={() => quarterlyNoteEvent?.emitEvent(currentMonth)}>Q{currentMonth?.quarter}</th>
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
                {currentMonth?.weeks.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        <td
                            className="weekNumber"
                            key={week.weekNumber}
                            onClick={() => weeklyNoteEvent?.emitEvent(week)}>{week.weekNumber}</td>
                        {WEEK_DAYS_ORDER.map((dayOfWeek, dayOfWeekIndex) => {
                            const day = week.days.find(d => d.dayOfWeek === dayOfWeek);
                            const isSelected = day != null && selectedDay?.completeDate === day.completeDate;
                            const isToday = day?.completeDate.isToday();

                            return (
                                <td key={dayOfWeekIndex}
                                    id={isToday ? 'today': ''}
                                    onClick={() => selectDay(day)}
                                    className={isSelected ? 'selected-day' : '' }>{day?.name}</td>
                            )
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};
