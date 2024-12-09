import {Day} from 'src/domain/models/day';
import React from 'react';
import { getSelectDayEvent } from 'src/components/providers/select-day-event.context';
import { getDailyNoteEvent } from 'src/components/providers/daily-note-event.context';

interface DayProps {
    day?: Day;
}

export const DayComponent = ({ day }: DayProps) => {
    const selectDayEvent = getSelectDayEvent();
    const dailyNoteEvent = getDailyNoteEvent();

    const [selectedDay, setSelectedDay] = React.useState<Day>();
    const isToday = day?.date?.isToday();
    const isSelected = selectedDay && day?.date?.toDateString() === selectedDay.date.toDateString();

    selectDayEvent?.onEvent('DayComponent', (day) => setSelectedDay(day));
    dailyNoteEvent?.onEvent('DayComponent', (day) => setSelectedDay(day));

    return (
        <td
            id={isToday ? 'today' : ''}
            className={isSelected ? 'selected-day' : ''}
            onClick={() => dailyNoteEvent?.emitEvent(day)}
        >{day?.name}</td>
    )
};