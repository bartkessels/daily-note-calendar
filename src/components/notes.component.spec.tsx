import React, {act} from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {NotesComponent} from './notes.component';
import {Note} from 'src/domain/models/note';
import {Event} from 'src/domain/events/event';
import {RefreshNotesEvent} from 'src/implementation/events/refresh-notes.event';
import {RefreshNotesEventContext} from 'src/components/providers/refresh-notes-event.context';
import {NotesViewModel} from 'src/components/viewmodels/notes.view-model';
import {NoteEventContext} from 'src/components/providers/note-event.context';
import 'src/extensions/extensions';
import {createNoteUiModel} from 'src/components/models/note.ui-model';
import {NotesViewState} from 'src/components/viewmodels/notes.view-state';
import {useNotesViewModel} from 'src/components/viewmodels/notes.view-model.provider';

jest.mock('src/components/viewmodels/notes.view-model.provider');

describe('NotesComponent', () => {
    const mockNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Note>;
    let refreshNotesEvent: Event<Note[]>;

    beforeEach(() => {
        refreshNotesEvent = new RefreshNotesEvent();
    });

    it('should render notes when the view state has uiModels', async () => {
        const notes: Note[] = [
            {name: 'Note 1', createdOn: new Date(2023, 9, 2, 10, 10), path: 'path/to/note1'},
            {name: 'Note 2', createdOn: new Date(2023, 9, 2, 11, 59), path: 'path/to/note2'},
        ];
        const viewModel: NotesViewModel = {
            viewState: {
                notes: notes.map(note => createNoteUiModel(note))
            } as NotesViewState,
            refreshNotes: jest.fn()
        };

        (useNotesViewModel as jest.Mock).mockReturnValue(viewModel);
        render(setupContent(mockNoteEvent, refreshNotesEvent));

        await waitFor(() => expect(screen.findAllByRole('listitem')).not.toBeNull());
        for (const note of notes) {
            await waitFor(() => expect(screen.getByText(note.name)).toBeDefined());
            await waitFor(() => expect(screen.getByText(`Created at ${note.createdOn.toLocaleTimeString()}`)).toBeDefined());
            await waitFor(() => expect(screen.getByText(note.path)).toBeDefined());
        }
    });

    it('should render nothing when the view state has no uiModels', async () => {
        const viewModel: NotesViewModel = {
            viewState: {
                notes: []
            } as NotesViewState,
            refreshNotes: jest.fn()
        };

        (useNotesViewModel as jest.Mock).mockReturnValue(viewModel);
        render(setupContent(mockNoteEvent, refreshNotesEvent));

        await waitFor(() => expect(screen.queryByRole('listitem')).toBeNull());
    });

    it('should emit the note event when the name of a note is clicked', async () => {
        const note: Note = {
            name: 'Note 1',
            createdOn: new Date(2023, 9, 2, 10, 10),
            path: 'path/to/note1'
        };
        const viewModel: NotesViewModel = {
            viewState: {
                notes: [createNoteUiModel(note)]
            } as NotesViewState,
            refreshNotes: jest.fn()
        };

        (useNotesViewModel as jest.Mock).mockReturnValue(viewModel);
        render(setupContent(mockNoteEvent, refreshNotesEvent));

        await waitFor(() => expect(screen.findAllByRole('listitem')).not.toBeNull());
        act(() => screen.getByText(note.name).click());

        expect(mockNoteEvent.emitEvent).toBeCalledWith(note);
    });

    it('should emit the note event when the created time of a note is clicked', async () => {
        const note: Note = {
            name: 'Note 1',
            createdOn: new Date(2023, 9, 2, 10, 10),
            path: 'path/to/note1'
        };
        const viewModel: NotesViewModel = {
            viewState: {
                notes: [createNoteUiModel(note)]
            } as NotesViewState,
            refreshNotes: jest.fn()
        };

        (useNotesViewModel as jest.Mock).mockReturnValue(viewModel);
        render(setupContent(mockNoteEvent, refreshNotesEvent));

        await waitFor(() => expect(screen.findAllByRole('listitem')).not.toBeNull());
        act(() => screen.getByText(`Created at ${note.createdOn.toLocaleTimeString()}`).click());

        expect(mockNoteEvent.emitEvent).toBeCalledWith(note);
    });

    it('should emit the note event when the path of a note is clicked', async () => {
        const note: Note = {
            name: 'Note 1',
            createdOn: new Date(2023, 9, 2, 10, 10),
            path: 'path/to/note1'
        };
        const viewModel: NotesViewModel = {
            viewState: {
                notes: [createNoteUiModel(note)]
            } as NotesViewState,
            refreshNotes: jest.fn()
        };

        (useNotesViewModel as jest.Mock).mockReturnValue(viewModel);
        render(setupContent(mockNoteEvent, refreshNotesEvent));

        await waitFor(() => expect(screen.findAllByRole('listitem')).not.toBeNull());
        act(() => screen.getByText(note.path).click());

        expect(mockNoteEvent.emitEvent).toBeCalledWith(note);
    });
});

function setupContent(
    noteEvent: Event<Note>,
    refreshNotesEvent: Event<Note[]>
): React.ReactElement {
    return (
        <NoteEventContext.Provider value={noteEvent}>
            <RefreshNotesEventContext.Provider value={refreshNotesEvent}>
                <NotesComponent/>
            </RefreshNotesEventContext.Provider>
        </NoteEventContext.Provider>
    );
}