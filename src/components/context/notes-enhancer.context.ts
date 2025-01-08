import {createContext, useContext} from 'react';
import {Enhancerold} from 'src/domain/enhancers/enhancerold';
import {NoteUiModel} from 'src/components/models/note.ui-model';

export const NotesEnhancerContext = createContext<Enhancerold<NoteUiModel[]> | null>(null);
export const useNotesEnhancer = (): Enhancerold<NoteUiModel[]> | null => {
    return useContext(NotesEnhancerContext);
}