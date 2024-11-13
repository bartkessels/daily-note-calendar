import React from 'react';
import { renderHook } from '@testing-library/react';
import { FileManagerContext, useFileManager } from './filemanager.provider';
import { FileManager } from 'src/domain/managers/file.manager';

describe('FileManagerContext', () => {
    const mockFileManager = {
        tryOpenWeeklyNote: jest.fn(),
        tryOpenDailyNote: jest.fn()
    } as unknown as FileManager;

    it('provides the FileManager instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <FileManagerContext.Provider value={mockFileManager}>
                {children}
            </FileManagerContext.Provider>
        );

        const { result } = renderHook(() => useFileManager(), { wrapper });

        expect(result.current).toBe(mockFileManager);
    });

    it('returns null when no FileManager is provided', () => {
        const { result } = renderHook(() => useFileManager());

        expect(result.current).toBeNull();
    });
});