import { CalendarHeart, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayOfWeek } from "src/domain/models/day";
import { useDateManager } from "src/components/providers/datemanager.provider";
import {getDailyNoteEvent} from "src/components/providers/daily-note-event.context";
import {getWeeklyNoteEvent} from "src/components/providers/weekly-note-event.context";
import {getMonthlyNoteEvent} from "src/components/providers/monthly-note-event.context";

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
    const [currentMonth, setCurrentMonth] = React.useState(dateManager?.getCurrentMonth());

    const dailyNoteEvent = getDailyNoteEvent();
    const weeklyNoteEvent = getWeeklyNoteEvent();
    const monthlyNoteEvent = getMonthlyNoteEvent();

    console.log(monthlyNoteEvent);

    const goToCurrentMonth = () => setCurrentMonth(dateManager?.getCurrentMonth());
    const goToNextMonth = () => setCurrentMonth(dateManager?.getNextMonth(currentMonth));
    const goToPreviousMonth = () => setCurrentMonth(dateManager?.getPreviousMonth(currentMonth));

    return (
        <>
            <div className="header">
                <span className="title">
                    <h1 onClick={() => monthlyNoteEvent?.emitEvent(currentMonth)}>{currentMonth?.name}</h1>&nbsp;
                    <h1 onClick={() => monthlyNoteEvent?.emitEvent(currentMonth)}>{currentMonth?.year}</h1>
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
                    <th></th>
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

                            return (
                                <td key={dayOfWeekIndex}
                                    onClick={() => dailyNoteEvent?.emitEvent(day)}
                                    className={day?.completeDate.isToday() ? 'today' : ''}>{day?.name}</td>
                            )
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};
