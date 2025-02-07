import {ModifierKey} from 'src-old/domain/models/modifier-key';
import React, {ReactElement} from 'react';
import {getNoteContextMenu} from 'src-old/components/context/note-context-menu.context';
import {Period} from 'src-old/domain/models/period';
import {ManageAction, ManageEvent} from 'src-old/domain/events/manage.event';
import {ContextMenuCallbacks} from 'src-old/domain/adapters/context-menu.adapter';

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
    if (!value) {
        return <></>;
    }

    const contextMenu = getNoteContextMenu();
    const contextMenuCallbacks: ContextMenuCallbacks = {
        onDelete: () => manageEvent?.emitEvent(ManageAction.Delete, value)
    }

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
                contextMenu?.show(e.clientX, e.clientY, contextMenuCallbacks);
                e.preventDefault();
            }}>{displayValue}</div>
    )
}