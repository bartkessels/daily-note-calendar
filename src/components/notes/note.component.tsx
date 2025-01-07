import {NoteUiModel} from 'src/components/models/note.ui-model';
import React, {ReactElement} from 'react';
import {getManageNoteEvent} from 'src/components/context/manage-note-event.context';
import {getNoteContextMenu} from 'src/components/context/note-context-menu.context';
import {ContextMenuCallbacks} from 'src/domain/adapters/context-menu.adapter';
import { ManageAction } from 'src/domain/events/manage.event';

export interface NoteProps {
    note?: NoteUiModel;
}

export const NoteComponent = ({ note }: NoteProps): ReactElement => {
    if (!note) {
        return <></>;
    }

    const manageNoteEvent = getManageNoteEvent();
    const contextMenu = getNoteContextMenu();
    const contextMenuCallbacks: ContextMenuCallbacks = {
        onDelete: () => manageNoteEvent?.emitEvent(ManageAction.Delete, note?.note)
    }

    return (
        <li
            title={note.displayFilePath}
            onClick={() => manageNoteEvent?.emitEvent(ManageAction.Open, note?.note)}
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