import React from 'react';
import {renderHook} from '@testing-library/react';
import {Enhancerold} from 'src/domain/enhancers/enhancerold';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {CalendarEnhancerContext, useCalenderEnhancer} from 'src/components/context/calendar-enhancer.context';

describe('CalendarEnhancerContext', () => {
    const mockEnhancer = {
        enhance: jest.fn()
    } as unknown as Enhancerold<CalendarUiModel>;

    it('provides the enhancer instance', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <CalendarEnhancerContext.Provider value={mockEnhancer}>
                {children}
            </CalendarEnhancerContext.Provider>
        );

        const { result } = renderHook(() => useCalenderEnhancer(), { wrapper });

        expect(result.current).toBe(mockEnhancer);
    });

    it('returns null when no enhancer is provided', () => {
        const { result } = renderHook(() => useCalenderEnhancer());

        expect(result.current).toBeNull();
    });
});