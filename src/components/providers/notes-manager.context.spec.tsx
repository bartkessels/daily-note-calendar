import React from 'react';
import {renderHook} from '@testing-library/react';
import {NotesManagerContext, getNotesManager} from 'src/components/providers/notes-manager.context';
import {NotesManager} from 'src/domain/managers/notes.manager';

describe('NotesManagerContext', () => {
    const mockNotesManager = {
        tryOpenNote: jest.fn(),
        getNotesCreatedOn: jest.fn()
    } as NotesManager;

    it('provides the NoteManager instance', () => {
        const wrapper = ({children}: { children: React.ReactNode }) => (
            <NotesManagerContext.Provider value={mockNotesManager}>
                {children}
            </NotesManagerContext.Provider>
        );

        const {result} = renderHook(() => getNotesManager(), {wrapper});

        expect(result.current).toBe(mockNotesManager);
    });

    it('returns null when no DayNoteRepository is provided', () => {
        const {result} = renderHook(() => getNotesManager());

        expect(result.current).toBeNull();
    });
});