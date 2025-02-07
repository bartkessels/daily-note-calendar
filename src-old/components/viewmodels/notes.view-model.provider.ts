import {getRefreshNotesEvent} from 'src-old/components/context/refresh-notes-event.context';
import {DefaultNotesViewModel, NotesViewModel} from 'src-old/components/viewmodels/notes.view-model';
import { NoteUiModel } from '../models/note.ui-model';
import React from 'react';
import {NotesViewState} from 'src-old/components/viewmodels/notes.view-state';
import {useNotesEnhancer} from 'src-old/components/context/notes-enhancer.context';

export const useNotesViewModel = (): NotesViewModel | undefined => {
    const refreshNotesEvent = getRefreshNotesEvent();
    const enhancer = useNotesEnhancer();

    const [viewState, setViewState] = React.useState<NotesViewState>({notes: []});
    const [viewModel, setViewModel] = React.useState<DefaultNotesViewModel>();

    React.useEffect(() => {
        const viewModel = new DefaultNotesViewModel(
            (uiModels: NoteUiModel[]): void => setViewState({...viewState, notes: uiModels}),
            refreshNotesEvent,
            enhancer
        );
        setViewModel(viewModel);
    }, [refreshNotesEvent, enhancer]);

    return viewModel?.withViewState(viewState);
};