import {ModifierKey} from 'src/domain/models/modifier-key';
import React, {ReactElement} from 'react';
import {getNoteContextMenu} from 'src/components/context/note-context-menu.context';

interface PeriodProps {
    value?: string;
    onClick: (modifierKey: ModifierKey) => void;
}

export const PeriodComponent = ({ value, onClick }: PeriodProps): ReactElement => {
    const noteContextMenu = getNoteContextMenu();

    const modifierKey = (event: React.MouseEvent): ModifierKey => {
        if (event.metaKey) {
            return ModifierKey.Meta;
        } else if (event.altKey) {
            return ModifierKey.Alt;
        } else if (event.shiftKey) {
            return ModifierKey.Shift;
        } else {
            return ModifierKey.None;
        }
    }

    if (!value) {
        return <></>;
    }

    return (
        <div
            onClick={(e: React.MouseEvent) => onClick(modifierKey(e))}
            onContextMenu={(e: React.MouseEvent) => {
                noteContextMenu?.show(e.clientX, e.clientY);
                e.preventDefault();
            }}>{value}</div>
    )
}