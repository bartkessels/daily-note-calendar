import {CalendarHeart, ChevronLeft, ChevronRight} from 'lucide-react';
import * as React from 'react';
import {dayEquals, DayOfWeek} from 'src/domain/models/day';
import {useCalendarViewModel} from 'src/components/calendar.viewmodel';

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
    const viewModel = useCalendarViewModel();

    return (
        <div className="dnc">
            <div className="header">
                <span className="title">
                    <h1 onClick={() => viewModel.openMonthlyNote(viewModel.viewState?.currentMonth)}>{viewModel.viewState?.currentMonth?.name}</h1>&nbsp;
                    <h1 onClick={() => viewModel.openYearlyNote(viewModel.viewState?.currentYear)}>{viewModel.viewState?.currentYear?.name}</h1>&nbsp;
                </span>

                <div className="buttons">
                    <ChevronLeft
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel.navigateToPreviousMonth()} />
                    <CalendarHeart
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel.navigateToCurrentMonth()} />
                    <ChevronRight
                        size={18}
                        strokeWidth={1}
                        onClick={() => viewModel.navigateToNextMonth()} />
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th className="quarter" onClick={() => viewModel.openQuarterlyNote(viewModel.viewState?.currentMonth)}>
                        {viewModel.viewState?.currentMonth?.quarter}
                    </th>
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
                {viewModel.viewState?.currentMonth?.weeks.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        <td
                            className="weekNumber"
                            key={week.weekNumber}
                            onClick={() => viewModel.openWeeklyNote(week)}>{week.weekNumber}</td>
                        {WEEK_DAYS_ORDER.map((dayOfWeek, dayOfWeekIndex) => {
                            const day = week.days.find(d => d.dayOfWeek === dayOfWeek);
                            const isSelected = dayEquals(day, viewModel.viewState?.selectedDay);
                            const isToday = dayEquals(day, viewModel.viewState?.today);

                            return (
                                <td key={dayOfWeekIndex}
                                    id={isToday ? 'today': ''}
                                    onClick={() => viewModel.openDailyNote(day)}
                                    className={isSelected ? 'selected-day' : '' }>{day?.name}</td>
                            )
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
