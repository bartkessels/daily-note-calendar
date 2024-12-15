import {DayComponent} from 'src/components/calendar/day.component';
import * as React from 'react';
import {WeekUiModel} from 'src/components/week.ui-model';
import {DayUiModel} from 'src/components/day.ui-model';
import {DayOfWeek} from 'src/domain/models/day';
import {getWeeklyNoteEvent} from 'src/components/providers/weekly-note-event.context';

export interface WeekProps {
    week?: WeekUiModel;
}

export const WeekComponent = ({week}: WeekProps) => {
    const weeklyNoteEvent = getWeeklyNoteEvent();
    const sortedDays = sortDays(week);

    return (
        <tr>
            <td
                className="weekNumber"
                key={week?.week.weekNumber}
                onClick={() => weeklyNoteEvent?.emitEvent(week?.week)}
            >{week?.week.weekNumber}</td>

            {sortedDays.map((day, dayIndex) =>
                <DayComponent key={dayIndex} day={day}/>
            )}
        </tr>
    );
}

function sortDays(week?: WeekUiModel): DayUiModel[] {
    const WEEK_DAYS_ORDER = [
        DayOfWeek.Monday,
        DayOfWeek.Tuesday,
        DayOfWeek.Wednesday,
        DayOfWeek.Thursday,
        DayOfWeek.Friday,
        DayOfWeek.Saturday,
        DayOfWeek.Sunday
    ];

    return WEEK_DAYS_ORDER.map((dayOfWeek) =>
        week?.days.find((day) => day.currentDay?.date.getDay() === dayOfWeek
    )) as DayUiModel[];
}
