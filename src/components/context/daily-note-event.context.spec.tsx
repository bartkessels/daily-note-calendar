import React from 'react';
import {renderHook} from '@testing-library/react';
import {DailyNoteEventContext, getDailyNoteEvent} from 'src/components/context/daily-note-event.context';
import {Event} from 'src/domain/events/event';
import {Day} from 'src/domain/models/day';

describe('DailyNoteEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Day>;

    it('provides the DailyNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <DailyNoteEventContext.Provider value={mockEvent}>
                {children}
            </DailyNoteEventContext.Provider>
        );

        const { result } = renderHook(() => getDailyNoteEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no DailyNoteEvent is provided', () => {
        const { result } = renderHook(() => getDailyNoteEvent());

        expect(result.current).toBeNull();
    });
});