import React from 'react';
import {renderHook} from '@testing-library/react';
import {getManageNoteEvent, ManageNoteEventContext} from 'src-old/components/context/manage-note-event.context';
import {Note} from 'src-old/domain/models/note';
import {ManageEvent} from 'src-old/domain/events/manage.event';

describe('ManageNoteEventContext', () => {
    const mockEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as ManageEvent<Note>;

    it('provides the ManageNoteEvent instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ManageNoteEventContext.Provider value={mockEvent}>
                {children}
            </ManageNoteEventContext.Provider>
        );

        const { result } = renderHook(() => getManageNoteEvent(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no NoteEvent is provided', () => {
        const { result } = renderHook(() => getManageNoteEvent());

        expect(result.current).toBeNull();
    });
});