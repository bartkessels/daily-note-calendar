import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src-old/domain/events/event';
import {getRefreshNotesEvent, RefreshNotesEventContext} from 'src-old/components/context/refresh-notes-event.context';
import {Note} from 'src-old/domain/models/note';

describe('RefreshNotesEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Note[]>;

    it('provides the WeeklyNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <RefreshNotesEventContext.Provider value={mockEvent}>
                {children}
            </RefreshNotesEventContext.Provider>
        );

        const { result } = renderHook(() => getRefreshNotesEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no WeeklyNoteEvent is provided', () => {
        const { result } = renderHook(() => getRefreshNotesEvent());

        expect(result.current).toBeNull();
    });
});