import {createContext, useContext} from 'react';
import {Event} from 'src/domain/events/event';
import {Note} from 'src/domain/models/note';

export const DeleteNoteEventContext = createContext<Event<Note> | null>(null);
export const getDeleteNoteEvent = (): Event<Note> | null => {
    return useContext(DeleteNoteEventContext);
}
