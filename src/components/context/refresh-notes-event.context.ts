import {createContext, useContext} from 'react';
import {Note} from 'src/domain/models/note';
import {Event} from 'src/domain/events/event';

export const RefreshNotesEventContext = createContext<Event<Note[]> | null>(null);
export const getRefreshNotesEvent = (): Event<Note[]> | null => {
    return useContext(RefreshNotesEventContext);
}