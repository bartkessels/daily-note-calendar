import {createContext, useContext} from 'react';
import {Event} from 'src/domain/events/event';
import {Note} from 'src/domain/models/note';

export const NoteEventContext = createContext<Event<Note> | null>(null);
export const getNoteEvent = (): Event<Note> | null => {
    return useContext(NoteEventContext);
}
