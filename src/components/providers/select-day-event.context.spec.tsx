import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src/domain/events/event';
import {getSelectDayEvent, SelectDayEventContext} from 'src/components/providers/select-day-event.context';
import {Day} from 'src/domain/models/day';

describe('SelectDayEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Day>;

    it('provides the WeeklyNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SelectDayEventContext.Provider value={mockEvent}>
                {children}
            </SelectDayEventContext.Provider>
        );

        const { result } = renderHook(() => getSelectDayEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no WeeklyNoteEvent is provided', () => {
        const { result } = renderHook(() => getSelectDayEvent());

        expect(result.current).toBeNull();
    });
});