import React from 'react';
import {renderHook} from '@testing-library/react';
import {DateManagerContext, useDateManager} from 'src/components/providers/datemanager.provider';
import {DateManager} from 'src/domain/managers/date.manager';

describe('DateManagerContext', () => {
    const mockDateManager = {
        getCurrentYear: jest.fn(),
        getYear: jest.fn(),
        getCurrentMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getPreviousMonth: jest.fn()
    } as DateManager;

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