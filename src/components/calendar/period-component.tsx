import {ModifierKey} from 'src/domain/models/modifier-key';
import React, {ReactElement} from 'react';

interface PeriodProps {
    value?: string;
    onClick: (modifierKey: ModifierKey) => void;
}

export const PeriodComponent = ({ value, onClick }: PeriodProps): ReactElement => {
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

    return (
        <div onClick={(e: React.MouseEvent) => onClick(modifierKey(e))}>
            {value}
        </div>
    )
}