import {Event} from 'src/domain/events/event';
import {Note} from 'src/domain/models/note';
import {NoteUiModel} from 'src/components/models/note.ui-model';
import React from 'react';
import {ManageEvent} from 'src/domain/events/manage.event';

export interface NotesEvent {
    manageNoteEvent?: ManageEvent<Note>;
    refreshNotesEvent?: Event<Note[]>;
    enhancedNotesEvent?: Event<NoteUiModel[]>;
}

export const NoteEventContext = React.createContext<NotesEvent | null>(null);

export const getManageNoteEvent = (): ManageEvent<Note> | null => {
    return React.useContext(NoteEventContext)?.manageNoteEvent ?? null;
}

export const getRefreshNotesEvent = (): Event<Note[]> | null => {
    return React.useContext(NoteEventContext)?.refreshNotesEvent ?? null;
};

export const getEnhancedNotesEvent = (): Event<NoteUiModel[]> | null => {
    return React.useContext(NoteEventContext)?.enhancedNotesEvent ?? null;
};
