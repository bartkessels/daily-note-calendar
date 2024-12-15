import React from 'react';
import {DayUiModel} from 'src/components/day.ui-model';
import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {Day} from 'src/domain/models/day';

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

    return (
        <td
            id={day?.isToday ? 'today' : ''}
            className={day?.isSelected ? 'selected-day' : ''}
            onClick={() => openDailyNote(day?.currentDay)}
        >{day?.currentDay?.name}</td>
    )
};