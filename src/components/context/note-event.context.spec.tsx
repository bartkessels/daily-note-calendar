import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src/domain/events/event';
import {getNoteEvent, NoteEventContext} from 'src/components/context/note-event.context';
import {Note} from 'src/domain/models/note';

describe('NoteEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Note>;

    it('provides the NoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <NoteEventContext.Provider value={mockEvent}>
                {children}
            </NoteEventContext.Provider>
        );

        const { result } = renderHook(() => getNoteEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no NoteEvent is provided', () => {
        const { result } = renderHook(() => getNoteEvent());

        expect(result.current).toBeNull();
    });
});