import {NotesViewState} from 'src/components/viewmodels/notes.view-state';
import {Note} from 'src/domain/models/note';
import {createNoteUiModel, NoteUiModel} from 'src/components/models/note.ui-model';
import {Event} from 'src/domain/events/event';
import {Enhancer} from 'src/domain/enhancers/enhancer';

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