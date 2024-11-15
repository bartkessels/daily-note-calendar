import React from 'react';
import {renderHook} from '@testing-library/react';
import {NoteRepository} from 'src/domain/repositories/note.repository';
import {Day} from 'src/domain/models/day';
import {DayNoteRepositoryContext, getDayNoteRepository} from 'src/components/providers/day-note-repository.context';

describe('DayNoteRepositoryContext', () => {
    const mockDayNoteRepository = {
        getNotesCreatedOn: jest.fn()
    } as NoteRepository<Day>;

    it('provides the DayNoteRepository instance', () => {
        const wrapper = ({children}: { children: React.ReactNode }) => (
            <DayNoteRepositoryContext.Provider value={mockDayNoteRepository}>
                {children}
            </DayNoteRepositoryContext.Provider>
        );

        const {result} = renderHook(() => getDayNoteRepository(), {wrapper});

        expect(result.current).toBe(mockDayNoteRepository);
    });

    it('returns null when no DayNoteRepository is provided', () => {
        const {result} = renderHook(() => getDayNoteRepository());

        expect(result.current).toBeNull();
    });
});