import {NotesViewState} from 'src/components/viewmodels/notes.view-state';
import {Note} from 'src/domain/models/note';
import {createNoteUiModel, NoteUiModel} from 'src/components/models/note.ui-model';
import {Event} from 'src/domain/events/event';
import {Enhancer} from 'src/domain/enhancers/enhancer';

export interface NotesViewModel {
    viewState: NotesViewState;

    refreshNotes: (notes?: Note[]) => void;
}

export class DefaultNotesViewModel implements NotesViewModel {
    private enhancer?: Enhancer<NoteUiModel[]> | null;
    public viewState: NotesViewState;

    constructor(
        private readonly setUiModel: (uiModels?: NoteUiModel[]) => void,
        private readonly refreshNotesEvent: Event<Note[]> | null,
        private readonly enhancedNotesEvent: Event<NoteUiModel[]> | null
    ) {
        this.refreshNotesEvent?.onEvent('NotesViewModel', (notes: Note[]) => this.refreshNotes(notes));
        this.enhancedNotesEvent?.onEvent('NotesViewModel', this.setUiModel);
    }

    public withEnhancer(enhancer?: Enhancer<NoteUiModel[]> | null): DefaultNotesViewModel {
        this.enhancer = enhancer;
        return this;
    }

    public withViewState(viewState: NotesViewState): NotesViewModel {
        this.viewState = viewState;
        return this;
    }

    public refreshNotes = (notes?: Note[]): void => {
        const uiModel = notes?.map((note) => createNoteUiModel(note)) ?? [];
        this.enhancer?.execute(uiModel);
    }
}