import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src/domain/events/event';
import {getRefreshNotesEvent, RefreshNotesEventContext} from 'src/components/providers/refresh-notes-event.context';
import {Note} from 'src/domain/models/note';

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