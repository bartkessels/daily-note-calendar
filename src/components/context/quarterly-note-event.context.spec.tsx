import React from 'react';
import {renderHook} from '@testing-library/react';
import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';
import {getQuarterlyNoteEvent, QuarterlyNoteEventContext} from 'src/components/context/quarterly-note-event.context';

describe('QuarterlyNoteEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as Event<Month>;

    it('provides the QuarterlyNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QuarterlyNoteEventContext.Provider value={mockEvent}>
                {children}
            </QuarterlyNoteEventContext.Provider>
        );

        const { result } = renderHook(() => getQuarterlyNoteEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no QuarterlyNoteEvent is provided', () => {
        const { result } = renderHook(() => getQuarterlyNoteEvent());

        expect(result.current).toBeNull();
    });
});