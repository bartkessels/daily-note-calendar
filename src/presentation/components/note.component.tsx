import {NoteUiModel} from 'src/presentation/models/note.ui-model';
import React, {ReactElement} from 'react';
import {getContextMenuAdapter} from 'src/presentation/context/context-menu-adapter.context';
import {ContextMenuCallbacks} from 'src/presentation/adapters/context-menu.adapter';

export interface NoteComponentProperties {
    note: NoteUiModel;
    onClick: (note: NoteUiModel) => void;
    onDelete: (note: NoteUiModel) => void;
}

export const NoteComponent = (props: NoteComponentProperties): ReactElement => {
    const contextMenu = getContextMenuAdapter();
    const contextMenuCallbacks: ContextMenuCallbacks = {
        openInCurrentTab: () => props.onClick(props.note),
        openInHorizontalSplitView: () => {},
        openInVerticalSplitView: () => {},
        onDelete: () => props.onDelete(props.note)
    };

    return (
        <li
            key={props.note.filePath}
            onContextMenu={(e: React.MouseEvent) => {
                contextMenu?.show(e.clientX, e.clientY, contextMenuCallbacks);
                e.preventDefault();
            }}
            onClick={(e: React.MouseEvent) => {
                props.onClick(props.note);
                e.preventDefault();
            }}>
            <span className="note-title">{props.note.name}</span><br/>
            <span className="note-date">Created at {props.note.date}</span><br/>
            <span className="note-path">{props.note.filePath}</span>
        </li>
    );
};