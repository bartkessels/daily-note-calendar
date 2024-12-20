import React from 'react';
import {DayUiModel} from 'src/components/models/day.ui-model';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';

interface DayProps {
    day?: DayUiModel;
}

export const DayComponent = ({ day }: DayProps) => {
    const dailyNoteEvent = getDailyNoteEvent();
    const classes: string[] = [];

    if (day?.isSelected) {
        classes.push('selected-day');
    }

    if (day?.hasNote) {
        classes.push('has-note');
    }

    return (
        <td
            id={day?.isToday ? 'today' : ''}
            height="30"
            className={classes.join(' ')}
            onClick={() => dailyNoteEvent?.emitEvent(day?.currentDay)}>
            {day?.currentDay?.name}
        </td>
    )
};