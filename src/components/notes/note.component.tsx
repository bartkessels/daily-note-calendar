import {NoteUiModel} from 'src/components/models/note.ui-model';
import React, {ReactElement} from 'react';
import {getNoteEvent} from 'src/components/context/note-event.context';
import {getNoteContextMenu} from 'src/components/context/note-context-menu.context';
import {getDeleteNoteEvent} from 'src/components/context/delete-note-event.context';
import {ContextMenuCallbacks} from 'src/domain/adapters/context-menu.adapter';

export interface NoteProps {
    note?: NoteUiModel;
}

export const NoteComponent = ({ note }: NoteProps): ReactElement => {
    if (!note) {
        return <></>;
    }

    const noteEvent = getNoteEvent();
    const deleteNoteEvent = getDeleteNoteEvent();
    const contextMenu = getNoteContextMenu();
    const contextMenuCallbacks: ContextMenuCallbacks = {
        onDelete: () => deleteNoteEvent?.emitEvent(note?.note)
    }

    return (
        <li
            title={note.displayFilePath}
            onClick={() => noteEvent?.emitEvent(note?.note)}
            onContextMenu={(e: React.MouseEvent) => {
                contextMenu?.show(e.clientX, e.clientY, contextMenuCallbacks);
                e.preventDefault();
            }}>
            <span className="note-title">{note.displayName}</span><br/>
            <span className="note-date">Created at {note.displayDate}</span><br/>
            <span className="note-path">{note.displayFilePath}</span>
        </li>
    )
}