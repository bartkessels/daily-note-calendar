import React, {ReactElement} from 'react';
import {getContextMenuAdapter} from 'src/presentation/context/context-menu-adapter.context';
import {ContextMenuCallbacks} from 'src/presentation/adapters/context-menu.adapter';
import {Note} from 'src/domain/models/note.model';

export interface NoteComponentProperties {
    note: Note;
    onOpenInHorizontalSplitView: (note: Note) => void;
    onOpenInVerticalSplitView: (note: Note) => void;
    onClick: (note: Note) => void;
    onDelete: (note: Note) => void;
}

export const NoteComponent = (props: NoteComponentProperties): ReactElement => {
    const contextMenu = getContextMenuAdapter();
    const contextMenuCallbacks: ContextMenuCallbacks = {
        openInHorizontalSplitView: () => props.onOpenInHorizontalSplitView(props.note),
        openInVerticalSplitView: () => props.onOpenInVerticalSplitView(props.note),
        onDelete: () => props.onDelete(props.note)
    };

    return (
        <li
            key={props.note.path}
            onContextMenu={(e: React.MouseEvent) => {
                contextMenu?.show(e.clientX, e.clientY, contextMenuCallbacks);
                e.preventDefault();
            }}
            onClick={(e: React.MouseEvent) => {
                props.onClick(props.note);
                e.preventDefault();
            }}>
            <span className="note-title">{props.note.name}</span><br/>
            {/*<span className="note-date">Created at {props.note.date}</span><br/>*/}
            {/*<span className="note-path">{props.note.filePath}</span>*/}
        </li>
    );
};