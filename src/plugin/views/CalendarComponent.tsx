import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayOfWeek } from "src/domain/models/Day";
import { UseDateRepository } from "../Providers/DateRepositoryProvider";
import { UseFileService } from "../Providers/FileServiceProvider";

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
    const dateRepository = UseDateRepository();
    const fileService = UseFileService();

    const [currentMonth, setCurrentMonth] = React.useState(dateRepository?.getCurrentMonth());
    const nextMonth = () => {
        if (currentMonth) {
            setCurrentMonth(dateRepository?.getMonth(currentMonth.year, currentMonth.monthIndex + 1));
        }
    }
    const previousMonth = () => {
        if (currentMonth) {
            setCurrentMonth(dateRepository?.getMonth(currentMonth.year, currentMonth.monthIndex - 1));
        }
    }

    const onWeekClicked = (date?: Date) => {
        if (date) {
            fileService?.tryOpenWeeklyNote(date);
        }
    }
    const onDayClicked = (date?: Date) => {
        if (date) {
            fileService?.tryOpenDailyNote(date);
        }
    }

    return (
        <>
            <div className="header">
                <h1>{currentMonth?.name} {currentMonth?.year}</h1>

                <div className="buttons">
                    <ChevronLeft
                        strokeWidth={1}
                        onClick={previousMonth} />
                    <ChevronRight
                        strokeWidth={1}
                        onClick={nextMonth} />
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
                                onClick={(() => onWeekClicked(week.days.first()?.completeDate))}>{week.weekNumber}</td>
                            {WEEK_DAYS_ORDER.map((dayOfWeek, dayOfWeekIndex) => {
                                const day = week.days.find(d => d.dayOfWeek === dayOfWeek);

                                return (
                                    <td
                                        key={dayOfWeekIndex}
                                        onClick={() => onDayClicked(day?.completeDate)}
                                        className={dateRepository?.isToday(day) ? 'today' : ''}>{day?.name}</td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
