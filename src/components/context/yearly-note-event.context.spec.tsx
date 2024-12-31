import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src/domain/events/event';
import {Year} from 'src/domain/models/year';
import {getYearlyNoteEvent, YearlyNoteEventContext} from 'src/components/context/yearly-note-event.context';

describe('YearlyNoteEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Year>;

    it('provides the YearlyNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <YearlyNoteEventContext.Provider value={mockEvent}>
                {children}
            </YearlyNoteEventContext.Provider>
        );

        const { result } = renderHook(() => getYearlyNoteEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no YearlyNoteEvent is provided', () => {
        const { result } = renderHook(() => getYearlyNoteEvent());

        expect(result.current).toBeNull();
    });
});