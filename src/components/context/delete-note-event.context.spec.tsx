import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src/domain/events/event';
import {Note} from 'src/domain/models/note';
import {DeleteNoteEventContext, getDeleteNoteEvent} from 'src/components/context/delete-note-event.context';

describe('DeleteNoteEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Note>;

    it('provides the DeleteNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <DeleteNoteEventContext.Provider value={mockEvent}>
                {children}
            </DeleteNoteEventContext.Provider>
        );

        const { result } = renderHook(() => getDeleteNoteEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no DeleteNoteEvent is provided', () => {
        const { result } = renderHook(() => getDeleteNoteEvent());

        expect(result.current).toBeNull();
    });
});