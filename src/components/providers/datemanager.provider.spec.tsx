import React from 'react';
import { renderHook } from '@testing-library/react';
import { DateManagerContext, useDateManager } from './datemanager.provider';
import { DateManager } from 'src/domain/managers/date.manager';

// Mock DateManager
const mockDateManager = {
    getCurrentMonth: jest.fn(),
    getNextMonth: jest.fn(),
    getPreviousMonth: jest.fn()
} as DateManager;

describe('DateManagerContext', () => {
    it('provides the DateManager instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <DateManagerContext.Provider value={mockDateManager}>
                {children}
                </DateManagerContext.Provider>
        );

        const { result } = renderHook(() => useDateManager(), { wrapper });

        expect(result.current).toBe(mockDateManager);
    });

    it('returns null when no DateManager is provided', () => {
        const { result } = renderHook(() => useDateManager());

        expect(result.current).toBeNull();
    });
});