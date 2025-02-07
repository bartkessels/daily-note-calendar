import React from 'react';
import {renderHook} from '@testing-library/react';
import {getNoteContextMenu, NoteContextMenuContext} from 'src-old/components/context/note-context-menu.context';
import {ContextMenuAdapter} from 'src-old/domain/adapters/context-menu.adapter';

describe('NoteContextMenuContext', () => {
    const mockEvent = {
        show: jest.fn(),
        hide: jest.fn()
    } as ContextMenuAdapter;

    it('provides the ContextMenuAdapter instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <NoteContextMenuContext.Provider value={mockEvent}>
                {children}
            </NoteContextMenuContext.Provider>
        );

        const { result } = renderHook(() => getNoteContextMenu(), { wrapper });

        expect(result.current).toBe(mockEvent);
    });

    it('returns null when no ContextMenuAdapter is provided', () => {
        const { result } = renderHook(() => getNoteContextMenu());

        expect(result.current).toBeNull();
    });
});