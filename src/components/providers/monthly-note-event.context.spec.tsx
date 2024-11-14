import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';
import {getMonthlyNoteEvent, MonthlyNoteEventContext} from 'src/components/providers/monthly-note-event.context';

describe('MonthlyNoteEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Month>;

    it('provides the MonthlyNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <MonthlyNoteEventContext.Provider value={mockEvent}>
                {children}
            </MonthlyNoteEventContext.Provider>
        );

        const { result } = renderHook(() => getMonthlyNoteEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no MonthlyNoteEvent is provided', () => {
        const { result } = renderHook(() => getMonthlyNoteEvent());

        expect(result.current).toBeNull();
    });
});