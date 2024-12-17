import React from 'react';
import {DayUiModel} from 'src/components/day.ui-model';
import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {Day} from 'src/domain/models/day';
import {Dot} from 'lucide-react';

interface DayProps {
    day?: DayUiModel;
}

export const DayComponent = ({ day }: DayProps) => {
    const selectDayEvent = getSelectDayEvent();
    const dailyNoteEvent = getDailyNoteEvent();

    const openDailyNote = (day?: Day): void => {
        selectDayEvent?.emitEvent(day);
        dailyNoteEvent?.emitEvent(day);
    };

    let classes: string[] = [];

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
            onClick={() => openDailyNote(day?.currentDay)}>
            {day?.currentDay?.name}

            {day?.hasNote ? <Dot
                size="15"
            /> : null}
        </td>
    )
};