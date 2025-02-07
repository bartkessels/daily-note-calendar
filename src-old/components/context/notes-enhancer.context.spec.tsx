import React from 'react';
import {renderHook} from '@testing-library/react';
import {Enhancer} from 'src-old/domain/enhancers/enhancer';
import {NoteUiModel} from 'src-old/components/models/note.ui-model';
import {NotesEnhancerContext, useNotesEnhancer} from './notes-enhancer.context';

describe('NotesEnhancerContext', () => {
    const mockEnhancer = {
        enhance: jest.fn()
    } as unknown as Enhancer<NoteUiModel[]>;

    it('provides the enhancer instance', () => {
        const wrapper = ({children}: { children: React.ReactNode }) => (
            <NotesEnhancerContext.Provider value={mockEnhancer}>
                {children}
            </NotesEnhancerContext.Provider>
        );

        const {result} = renderHook(() => useNotesEnhancer(), {wrapper});

        expect(result.current).toBe(mockEnhancer);
    });

    it('returns null when no enhancer is provided', () => {
        const {result} = renderHook(() => useNotesEnhancer());

        expect(result.current).toBeNull();
    });
});