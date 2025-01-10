import {DefaultNotesViewModel, NotesViewModel} from 'src/components/viewmodels/notes.view-model';
import { NoteUiModel } from '../models/note.ui-model';
import React from 'react';
import {NotesViewState} from 'src/components/viewmodels/notes.view-state';
import {getDisplayDateEnhancer} from 'src/components/context/notes-enhancer.context';
import {getEnhancedNotesEvent, getRefreshNotesEvent} from 'src/components/context/notes-event.context';

export const useNotesViewModel = (): NotesViewModel | undefined => {
    const refreshNotesEvent = getRefreshNotesEvent();
    const enhancedNotesEvent = getEnhancedNotesEvent();
    const displayDateEnhancer = getDisplayDateEnhancer();

    const [viewState, setViewState] = React.useState<NotesViewState>({notes: []});
    const [viewModel, setViewModel] = React.useState<DefaultNotesViewModel>();

    React.useEffect(() => {
        const viewModel = new DefaultNotesViewModel(
            (uiModels: NoteUiModel[]): void => setViewState({...viewState, notes: uiModels}),
            refreshNotesEvent,
            enhancedNotesEvent
        ).withEnhancer(displayDateEnhancer);
        setViewModel(viewModel);
    }, [refreshNotesEvent, displayDateEnhancer]);

    return viewModel?.withViewState(viewState);
};