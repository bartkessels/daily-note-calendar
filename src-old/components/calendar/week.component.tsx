import {DayComponent} from 'src-old/components/calendar/day.component';
import * as React from 'react';
import {WeekUiModel} from 'src-old/components/models/week.ui-model';
import {ReactElement} from 'react';
import {PeriodComponent} from 'src-old/components/calendar/period-component';
import {getManageWeekEvent} from 'src-old/components/context/periodic-note-event.context';

export interface WeekProps {
    week?: WeekUiModel;
}

export const WeekComponent = ({week}: WeekProps): ReactElement => {
    const manageWeekEvent = getManageWeekEvent();
    const classes: string[] = ['weekNumber'];

    if (week?.hasNote) {
        classes.push('has-note');
    }

    return (
        <tr>
            <td
                className={classes.join(' ')}
                key={week?.week?.weekNumber}>

                <PeriodComponent
                    value={week?.week}
                    manageEvent={manageWeekEvent}
                    displayValue={week?.week?.weekNumber} />
            </td>

            {week?.days.map((day, dayIndex) =>
                <DayComponent key={dayIndex} day={day}/>
            )}
        </tr>
    );
}
