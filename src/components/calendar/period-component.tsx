import {ModifierKey} from 'src/domain/models/modifier-key';
import React, {ReactElement} from 'react';
import {getNoteContextMenu} from 'src/components/context/note-context-menu.context';
import {Period} from 'src/domain/models/period';
import {ManageAction, ManageEvent} from 'src/domain/events/manage.event';

interface PeriodProps {
    displayValue?: string;
    manageEvent?: ManageEvent<Period> | null,
    value?: Period;
    onClick?: (modifierKey: ModifierKey) => void;
}

export const PeriodComponent = ({
    displayValue,
    value,
    manageEvent,
    onClick
}: PeriodProps): ReactElement => {
    const noteContextMenu = getNoteContextMenu();

    const modifierKey = (event: React.MouseEvent): ModifierKey => {
        if (event.metaKey) {
            return ModifierKey.Meta;
        } else if (event.altKey) {
            return ModifierKey.Alt;
        } else if (event.shiftKey) {
            return ModifierKey.Shift;
        }

        return ModifierKey.None;
    }

    if (!value) {
        return <></>;
    }

    return (
        <div
            onClick={(e: React.MouseEvent) => {
                if (onClick) {
                    onClick(modifierKey(e));
                } else {
                    manageEvent?.emitEvent(ManageAction.Open, value, modifierKey(e))
                }

                e.preventDefault();
            }}
            onContextMenu={(e: React.MouseEvent) => {
                noteContextMenu?.show(e.clientX, e.clientY, {
                    onDelete: (): void => manageEvent?.emitEvent(ManageAction.Delete, value)
                });
                e.preventDefault();
            }}>{displayValue}</div>
    )
}