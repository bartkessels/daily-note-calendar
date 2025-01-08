import React from 'react';
import {renderHook} from '@testing-library/react';
import {Enhancerold} from 'src/domain/enhancers/enhancerold';
import {NoteUiModel} from 'src/components/models/note.ui-model';
import {NotesEnhancerContext, useNotesEnhancer} from './notes-enhancer.context';

describe('NotesEnhancerContext', () => {
    const mockEnhancer = {
        enhance: jest.fn()
    } as unknown as Enhancerold<NoteUiModel[]>;

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