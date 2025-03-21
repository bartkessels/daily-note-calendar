import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import React, {ReactElement} from 'react';
import {getContextMenuAdapter} from 'src/presentation/context/context-menu-adapter.context';
import {ContextMenuCallbacks} from 'src/presentation/contracts/context-menu-adapter';

interface PeriodComponentProperties {
    isSelected?: boolean;
    isToday?: boolean;
    model?: PeriodUiModel | null;
    onClick: (key: ModifierKey, model: PeriodUiModel) => void;
    onDelete: (model: PeriodUiModel) => void;
}

export const PeriodComponent = (props: PeriodComponentProperties): ReactElement => {
    if (!props.model || !props.model.period) {
        return <></>;
    }

    const contextMenu = getContextMenuAdapter();
    const contextMenuCallbacks: ContextMenuCallbacks = {
        onDelete: () => props.onDelete(props.model!)
    };
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
    if (props.isSelected) {
        classes.push('selected-day');
    }
    if (props.model.hasPeriodNote) {
        classes.push('has-note');
    }

    return (
        <div
            id={props.isToday ? 'today' : ''}
            className={classes.join(' ')}
            onContextMenu={(e: React.MouseEvent) => {
                contextMenu?.show(e.clientX, e.clientY, contextMenuCallbacks);
                e.preventDefault();
            }}
            onClick={(e: React.MouseEvent) => {
                props.onClick(modifierKey(e), props.model!);
                e.preventDefault();
            }}>{props.model.period.name}</div>
    );
};