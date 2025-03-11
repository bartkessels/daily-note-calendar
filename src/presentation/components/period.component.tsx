import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import React, {ReactElement} from 'react';

interface PeriodComponentProperties {
    isSelected?: boolean;
    isToday?: boolean;
    model?: PeriodUiModel | null;
    onClick: (key: ModifierKey, model: PeriodUiModel) => void;
}

export const PeriodComponent = (
    {
        isSelected = false,
        isToday = false,
        model, onClick
    }: PeriodComponentProperties
): ReactElement => {
    if (!model || !model.period) {
        return <></>;
    }

    const modifierKey = (event: React.MouseEvent): ModifierKey => {
        if (event.metaKey) {
            return ModifierKey.Meta;
        } else if (event.altKey) {
            return ModifierKey.Alt;
        } else if (event.shiftKey) {
            return ModifierKey.Shift;
        }

        return ModifierKey.None
    };

    const classes: string[] = [];
    if (isSelected) {
        classes.push('selected-day');
    }
    if (model.hasPeriodNote) {
        classes.push('has-note');
    }

    return (
        <div
            id={isToday ? 'today' : ''}
            className={classes.join(' ')}
            {...model.notes.length > 0 ? { title: `Number of notes: ${model.notes.length}` } : {}}
            onClick={(e: React.MouseEvent) => {
                onClick(modifierKey(e), model);
                e.preventDefault();
            }}>{model.period.name}</div>
    );
};