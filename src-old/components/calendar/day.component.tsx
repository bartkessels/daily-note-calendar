import React, {ReactElement} from 'react';
import {DayUiModel} from 'src-old/components/models/day.ui-model';
import {ModifierKey} from 'src-old/domain/models/modifier-key';
import {PeriodComponent} from 'src-old/components/calendar/period-component';
import {ManageAction} from 'src-old/domain/events/manage.event';
import {getManageDayEvent} from 'src-old/components/context/periodic-note-event.context';

interface DayProps {
    day?: DayUiModel;
}

export const DayComponent = ({day}: DayProps): ReactElement => {
    const manageDayEvent = getManageDayEvent();
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
            <PeriodComponent
                value={day?.currentDay}
                manageEvent={manageDayEvent}
                displayValue={day?.currentDay?.name}
                onClick={(modifierKey) => {
                    if (modifierKey === ModifierKey.Shift) {
                        manageDayEvent?.emitEvent(ManageAction.Preview, day?.currentDay);
                    } else {
                        manageDayEvent?.emitEvent(ManageAction.Open, day?.currentDay, modifierKey);
                    }
                }}/>
        </td>
    )
};