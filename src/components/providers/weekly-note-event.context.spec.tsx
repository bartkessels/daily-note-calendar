import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src/domain/events/event';
import {Week} from 'src/domain/models/week';
import {getWeeklyNoteEvent, WeeklyNoteEventContext} from 'src/components/providers/weekly-note-event.context';

describe('WeeklyNoteEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Week>;

    it('provides the WeeklyNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <WeeklyNoteEventContext.Provider value={mockEvent}>
                {children}
            </WeeklyNoteEventContext.Provider>
        );

        const { result } = renderHook(() => getWeeklyNoteEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no WeeklyNoteEvent is provided', () => {
        const { result } = renderHook(() => getWeeklyNoteEvent());

        expect(result.current).toBeNull();
    });
});