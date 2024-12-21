import { DefaultNotesViewModel } from 'src/components/viewmodels/notes.view-model';
import { Note } from 'src/domain/models/note';
import { createNoteUiModel, NoteUiModel } from 'src/components/models/note.ui-model';
import { Enhancer } from 'src/domain/enhancers/enhancer';
import { Event } from 'src/domain/events/event';
import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';
import {waitFor} from '@testing-library/react';
import 'src/extensions/extensions';
import {NotesViewState} from 'src/components/viewmodels/notes.view-state';

describe('DefaultNotesViewModel', () => {
    let setUiModel: jest.Mock;
    let refreshNotesEvent: Event<Note[]>;
    let enhancer: Enhancer<NoteUiModel[]>;

    beforeEach(() => {
        setUiModel = jest.fn();
        refreshNotesEvent = {
            onEvent: jest.fn(),
            emitEvent: jest.fn()
        } as unknown as Event<Note[]>;
        enhancer = new EnhancerDouble();
    });

    function createViewModel(): DefaultNotesViewModel {
        return new DefaultNotesViewModel(setUiModel, refreshNotesEvent, enhancer);
    }

    it('should update the UI model with the provided notes when the refresh event is emitted', async () => {
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10, 10), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11, 59), path: 'path/to/note2' }
        ];
        const noteUiModels: NoteUiModel[] = notes.map(note => createNoteUiModel(note));

        const viewModel = createViewModel();
        await viewModel.refreshNotes(notes);

        await waitFor(() => {
            expect(setUiModel).toHaveBeenCalledWith(noteUiModels);
        })
    });

    it('sets the view state to the provided value', () => {
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10, 10), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11, 59), path: 'path/to/note2' }
        ];
        const noteUiModels: NoteUiModel[] = notes.map(note => createNoteUiModel(note));
        const viewState: NotesViewState = {
            notes: noteUiModels
        }

        const viewModel = createViewModel();

        const result = viewModel.withViewState(viewState);

        expect(result.viewState).toBe(viewState);
    });
});

class EnhancerDouble implements Enhancer<NoteUiModel[]> {
    private value?: NoteUiModel[];

    withValue(value: NoteUiModel[]): Enhancer<NoteUiModel[]> {
        this.value = value;
        return this;
    }

    withStep(_: EnhancerStep<NoteUiModel[]>): Enhancer<NoteUiModel[]> {
        return this;
    }

    async build(): Promise<NoteUiModel[] | undefined> {
        return this.value;
    }
}
