import {createContext, useContext} from 'react';
import {NotesViewModel} from 'src/presentation/view-models/notes.view-model';

export const NotesViewModelContext = createContext<NotesViewModel | null>(null);
export const useNotesViewModel = (): NotesViewModel | null => {
    return useContext(NotesViewModelContext);
};