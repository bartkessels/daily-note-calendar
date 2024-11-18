import {createContext, useContext} from 'react';
import {NotesManager} from 'src/domain/managers/notes.manager';

export const NotesManagerContext = createContext<NotesManager | null>(null);
export const getNotesManager = (): NotesManager | null => {
    return useContext(NotesManagerContext);
}
