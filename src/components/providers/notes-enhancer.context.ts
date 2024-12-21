import {createContext, useContext} from 'react';
import {Enhancer} from 'src/domain/enhancers/enhancer';
import {NoteUiModel} from 'src/components/models/note.ui-model';

export const NotesEnhancerContext = createContext<Enhancer<NoteUiModel[]> | null>(null);
export const useNotesEnhancer = (): Enhancer<NoteUiModel[]> | null => {
    return useContext(NotesEnhancerContext);
}