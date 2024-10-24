import { DayOfWeek } from "src/domain/models/Day";
import { Month } from "src/domain/models/Month";
import { Year } from "src/domain/models/Year";

interface CalendarUiProps {
    year: Year;
    month: Month;
    onDateClicked: (date?: Date) => void,
    onWeekClicked: (date?: Date) => void
}

export const CalendarUi = (
    { year, month, onDateClicked, onWeekClicked }: CalendarUiProps
) => {
    const weekDisplay = [
      DayOfWeek.Monday,
      DayOfWeek.Tuesday,
      DayOfWeek.Wednesday,
      DayOfWeek.Thursday,
      DayOfWeek.Friday,
      DayOfWeek.Saturday,
      DayOfWeek.Sunday
    ];

    return (
      <div>
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
                    {month.weeks.map((week, weekIndex) => (
                        <tr key={weekIndex}>
                            <td
                                className="weekNumber"
                                key={week.weekNumber}
                                onClick={(() => onWeekClicked(week.days.first()?.completeDate))}>{week.weekNumber}</td>
                            {weekDisplay.map((dayOfWeek, dayOfWeekIndex) => {
                                const day = week.days.find(d => d.dayOfWeek === dayOfWeek);
                                return (
                                    <td
                                        key={dayOfWeekIndex}
                                        onClick={() => onDateClicked(day?.completeDate)}
                                        className={day?.completeDate?.getMonth() != month?.monthIndex ? 'otherMonth' : ''}>{day?.name}</td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}