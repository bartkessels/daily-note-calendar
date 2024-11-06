import { CalendarHeart, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayOfWeek } from "src/domain/models/Day";
import { useDateManager } from "./providers/datemanager.provider";
import {useFileManager} from "src/components/providers/filemanager.provider";

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
    const fileManager = useFileManager();
    const [currentMonth, setCurrentMonth] = React.useState(dateManager?.getCurrentMonth());

    const goToCurrentMonth = () => setCurrentMonth(dateManager?.getCurrentMonth());
    const goToNextMonth = () => setCurrentMonth(dateManager?.getNextMonth(currentMonth));
    const goToPreviousMonth = () => setCurrentMonth(dateManager?.getPreviousMonth(currentMonth));
    const onWeekClicked = (date?: Date) => fileManager?.tryOpenWeeklyNote(date);
    const onDayClicked = (date?: Date) => fileManager?.tryOpenDailyNote(date);

    return (
        <>
            <div className="header">
                <h1>{currentMonth?.name} {currentMonth?.year}</h1>

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
                            onClick={(() => onWeekClicked(week.days.at(0)?.completeDate))}>{week.weekNumber}</td>
                        {WEEK_DAYS_ORDER.map((dayOfWeek, dayOfWeekIndex) => {
                            const day = week.days.find(d => d.dayOfWeek === dayOfWeek);

                            return (
                                <td
                                    key={dayOfWeekIndex}
                                    onClick={() => onDayClicked(day?.completeDate)}
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
