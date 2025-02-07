import {createContext, useContext} from 'react';
import {Enhancer} from 'src-old/domain/enhancers/enhancer';
import {NoteUiModel} from 'src-old/components/models/note.ui-model';

export const NotesEnhancerContext = createContext<Enhancer<NoteUiModel[]> | null>(null);
export const useNotesEnhancer = (): Enhancer<NoteUiModel[]> | null => {
    return useContext(NotesEnhancerContext);
}