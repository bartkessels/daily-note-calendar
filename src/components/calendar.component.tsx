import {CalendarHeart, ChevronLeft, ChevronRight} from 'lucide-react';
import * as React from 'react';
import {dayEquals, DayOfWeek} from 'src/domain/models/day';
import {useCalendarViewModel} from 'src/components/calendar.view-model';
import {useDayViewModel} from 'src/components/day.view-model';
import {useMonthViewModel} from 'src/components/month.view-model';

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
    const dayViewModel = useDayViewModel();
    const monthViewModel = useMonthViewModel();

    viewModel.init();
    monthViewModel.init();

    console.log(monthViewModel.viewState);

    return (
        <div className="dnc">
            <div className="header">
                <span className="title">
                    <h1 onClick={() => monthViewModel.openMonthlyNote(monthViewModel.viewState?.currentMonth)}>{monthViewModel.viewState?.currentMonth?.name}</h1>&nbsp;
                    <h1 onClick={() => viewModel.openYearlyNote(viewModel.viewState?.currentYear)}>{viewModel.viewState?.currentYear?.name}</h1>&nbsp;
                </span>

                <div className="buttons">
                    <ChevronLeft
                        size={18}
                        strokeWidth={1}
                        onClick={() => monthViewModel.navigateToPreviousMonth()} />
                    <CalendarHeart
                        size={18}
                        strokeWidth={1}
                        onClick={() => monthViewModel.navigateToCurrentMonth()} />
                    <ChevronRight
                        size={18}
                        strokeWidth={1}
                        onClick={() => monthViewModel.navigateToNextMonth()} />
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th className="quarter" onClick={() => viewModel.openQuarterlyNote(monthViewModel.viewState?.currentMonth)}>
                        {monthViewModel.viewState?.currentMonth?.quarter}
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
                {monthViewModel.viewState?.currentMonth?.weeks.map((week, weekIndex) => (
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
                                    onClick={() => dayViewModel.openDailyNote(day)}
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
