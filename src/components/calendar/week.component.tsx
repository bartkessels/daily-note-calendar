import {DayComponent} from 'src/components/calendar/day.component';
import * as React from 'react';
import {WeekUiModel} from 'src/components/models/week.ui-model';
import {getWeeklyNoteEvent} from 'src/components/providers/weekly-note-event.context';

export interface WeekProps {
    week?: WeekUiModel;
}

export const WeekComponent = ({week}: WeekProps) => {
    const weeklyNoteEvent = getWeeklyNoteEvent();

    return (
        <tr>
            <td
                className="weekNumber"
                key={week?.week?.weekNumber}
                onClick={() => weeklyNoteEvent?.emitEvent(week?.week)}
            >{week?.week?.weekNumber}</td>

            {week?.days.map((day, dayIndex) =>
                <DayComponent key={dayIndex} day={day}/>
            )}
        </tr>
    );
}
