import React from 'react';
import {render, waitFor, screen} from '@testing-library/react';
import { NotesComponent } from './notes.component';
import { Note } from 'src/domain/models/note';
import { Event } from 'src/domain/events/event';
import {RefreshNotesEvent} from 'src/implementation/events/refresh-notes.event';
import {RefreshNotesEventContext} from 'src/components/providers/refresh-notes-event.context';

describe('NotesComponent', () => {
    let refreshNotesEvent: Event<Note[]>;

    beforeEach(() => {
        refreshNotesEvent = new RefreshNotesEvent();
    });

    it('should render notes when a refresh notes event is emitted', async () => {
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11), path: 'path/to/note2' },
        ];

        render(
            <RefreshNotesEventContext.Provider value={refreshNotesEvent}>
                <NotesComponent />
            </RefreshNotesEventContext.Provider>
        );

        React.act(() => refreshNotesEvent.emitEvent(notes));

        await waitFor(() => expect(screen.findAllByRole('listitem')).not.toBeNull());
        for (const note of notes) {
            await waitFor(() => expect(screen.getByText(note.name)).toBeDefined());
            await waitFor(() => expect(screen.getByText(`Created at ${note.createdOn.toLocaleTimeString()}`)).toBeDefined());
            await waitFor(() => expect(screen.getByText(note.path)).toBeDefined());
        }
    });

    it('should render nothing when the refresh notes event emits an empty list', async () => {
        render(
            <RefreshNotesEventContext.Provider value={refreshNotesEvent}>
                <NotesComponent />
            </RefreshNotesEventContext.Provider>
        );

        React.act(() => refreshNotesEvent.emitEvent([]));

        await waitFor(() => expect(screen.queryByRole('listitem')).toBeNull());
    });
});