import {NotesViewState} from 'src-old/components/viewmodels/notes.view-state';
import {Note} from 'src-old/domain/models/note';
import {createNoteUiModel, NoteUiModel} from 'src-old/components/models/note.ui-model';
import {Event} from 'src-old/domain/events/event';
import {Enhancer} from 'src-old/domain/enhancers/enhancer';

export interface NotesViewModel {
    viewState: NotesViewState;

    refreshNotes: (notes?: Note[]) => Promise<void>;
}

export class DefaultNotesViewModel implements NotesViewModel {
    public viewState: NotesViewState;

    constructor(
        private readonly setUiModel: (uiModels?: NoteUiModel[]) => void,
        private readonly refreshNotesEvent: Event<Note[]> | null,
        private readonly enhancer: Enhancer<NoteUiModel[]> | null
    ) {
        this.refreshNotesEvent?.onEvent('NotesViewModel', (notes: Note[]) => this.refreshNotes(notes));
    }

    public withViewState(viewState: NotesViewState): NotesViewModel {
        return {
            ...this,
            viewState: viewState
        };
    }

    public refreshNotes = async (notes?: Note[]): Promise<void> => {
        const uiModel = notes?.map((note) => createNoteUiModel(note)) ?? [];
        const enhancedUiModel = await this.enhancer?.withValue(uiModel).build();

        this.setUiModel(enhancedUiModel);
    }
}