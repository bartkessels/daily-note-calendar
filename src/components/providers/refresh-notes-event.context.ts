import {RefreshNotesEvent} from 'src/implementation/events/refresh-notes.event';
import {createContext, useContext} from 'react';

export const RefreshNotesEventContext = createContext<RefreshNotesEvent | null>(null);
export const getRefreshNotesEvent = (): RefreshNotesEvent | null => {
    return useContext(RefreshNotesEventContext);
}