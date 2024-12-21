import {DayComponent} from 'src/components/calendar/day.component';
import * as React from 'react';
import {WeekUiModel} from 'src/components/models/week.ui-model';
import {getWeeklyNoteEvent} from 'src/components/providers/weekly-note-event.context';
import {ReactElement} from 'react';

export interface WeekProps {
    week?: WeekUiModel;
}

export const WeekComponent = ({week}: WeekProps): ReactElement => {
    const weeklyNoteEvent = getWeeklyNoteEvent();
    const classes: string[] = ['weekNumber'];

    if (week?.hasNote) {
        classes.push('has-note');
    }

    return (
        <tr>
            <td
                className={classes.join(' ')}
                key={week?.week?.weekNumber}
                onClick={() => weeklyNoteEvent?.emitEvent(week?.week)}
            >{week?.week?.weekNumber}</td>

            {week?.days.map((day, dayIndex) =>
                <DayComponent key={dayIndex} day={day}/>
            )}
        </tr>
    );
}
