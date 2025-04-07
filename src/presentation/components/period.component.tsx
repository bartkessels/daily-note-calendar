import React, {ReactElement} from 'react';
import {getContextMenuAdapter} from 'src/presentation/context/context-menu-adapter.context';
import {ContextMenuCallbacks} from 'src/presentation/adapters/context-menu.adapter';
import {ModifierKey} from 'src/domain/models/modifier-key';

interface PeriodComponentProperties {
    name: string;
    classNames?: string[];
    isSelected: boolean;
    isToday: boolean;
    hasPeriodNote: boolean;
    onClick: (key: ModifierKey) => void;
    onOpenInHorizontalSplitViewClick: (key: ModifierKey) => void;
    onOpenInVerticalSplitViewClick: (key: ModifierKey) => void;
    onDelete: () => void;
}

export const PeriodComponent = (props: PeriodComponentProperties): ReactElement => {
    const contextMenu = getContextMenuAdapter();
    const contextMenuCallbacks = (key: ModifierKey) => {
        return {
            openInHorizontalSplitView: () => props.onOpenInHorizontalSplitViewClick(key),
            openInVerticalSplitView: () => props.onOpenInVerticalSplitViewClick(key),
            onDelete: () => props.onDelete()
        } as ContextMenuCallbacks;
    };

    const modifierKey = (event: React.MouseEvent): ModifierKey => {
        if ((event.metaKey || event.ctrlKey) && event.altKey) {
            return ModifierKey.MetaAlt
        } else if (event.metaKey) {
            return ModifierKey.Meta;
        } else if (event.altKey) {
            return ModifierKey.Alt;
        } else if (event.shiftKey) {
            return ModifierKey.Shift;
        } else {
            return ModifierKey.None
        }
    }

    const classes: string[] = props.classNames ?? [];
    if (props.isSelected) {
        classes.push('selected-day');
    }
    if (props.hasPeriodNote) {
        classes.push('has-note');
    }

    return (
        <div
            id={props.isToday ? 'today' : ''}
            className={classes.join(' ')}
            onContextMenu={(e: React.MouseEvent) => {
                const callbacks = contextMenuCallbacks(modifierKey(e));
                contextMenu?.show(e.clientX, e.clientY, callbacks);
                e.preventDefault();
            }}
            onClick={(e: React.MouseEvent) => {
                props.onClick(modifierKey(e));
                e.preventDefault();
            }}>{props.name}</div>
    );
};