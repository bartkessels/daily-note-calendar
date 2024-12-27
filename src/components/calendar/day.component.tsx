import React, {ReactElement} from 'react';
import {DayUiModel} from 'src/components/models/day.ui-model';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import {ModifierKey} from 'src/domain/models/modifier-key';
import {PeriodComponent} from 'src/components/calendar/period-component';

interface DayProps {
    day?: DayUiModel;
}

export const DayComponent = ({ day }: DayProps): ReactElement => {
    const dailyNoteEvent = getDailyNoteEvent();
    const selectDayEvent = getSelectDayEvent();
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
            className={classes.join(' ')}>
                <PeriodComponent value={day?.currentDay?.name} onClick={(modifierKey) => {
                    if (modifierKey === ModifierKey.Shift) {
                        selectDayEvent?.emitEvent(day?.currentDay);
                    } else {
                        dailyNoteEvent?.emitEvent(day?.currentDay, modifierKey);
                    }
                }} />
        </td>
    )
};