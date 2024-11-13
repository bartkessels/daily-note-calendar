import React from 'react';
import {renderHook} from '@testing-library/react';
import { DailyNoteEventContext } from './daily-note-event.context';
import {DailyNoteEvent} from 'src/implementation/events/daily-note.event';
import {useFileManager} from 'src/components/providers/filemanager.provider';

describe('DailyNoteEventContext', () => {
    const event = new DailyNoteEvent();

    it('provides the FileManager instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <DailyNoteEventContext.Provider value={event}>
                {children}
            </DailyNoteEventContext.Provider>
        );

        const { result } = renderHook(() => useFileManager(), { wrapper });

        expect(result.current).toBe(event);
    });

    it('returns null when no FileManager is provided', () => {
        const { result } = renderHook(() => useFileManager());

        expect(result.current).toBeNull();
    });
});