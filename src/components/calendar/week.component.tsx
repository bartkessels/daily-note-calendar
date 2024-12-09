import {Week} from 'src/domain/models/week';
import {DayComponent} from 'src/components/calendar/day.component';
import {DayOfWeek} from 'src/domain/models/day';
import * as React from 'react';
import { getWeeklyNoteEvent } from 'src/components/providers/weekly-note-event.context';

interface WeekProps {
    week?: Week;
}

const WEEK_DAYS_ORDER = [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
    DayOfWeek.Sunday
];

export const WeekComponent = ({ week }: WeekProps) => {
    const weeklyNoteEvent = getWeeklyNoteEvent();

    const sortedDays = WEEK_DAYS_ORDER.map((dayOfWeek) =>
        week?.days.find((day) => day.date.getDay() === dayOfWeek
    ));

    return (
        <tr>
            <td
                className="weekNumber"
                key={week?.weekNumber}
                onClick={() => weeklyNoteEvent?.emitEvent(week)}
            >{week?.weekNumber}</td>

            {sortedDays.map((day, dayIndex) =>
                <DayComponent key={dayIndex} day={day} />)}
        </tr>
    );
}