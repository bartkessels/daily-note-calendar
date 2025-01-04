import React from 'react';
import {renderHook} from '@testing-library/react';
import {
    getManageDayEvent, getManageMonthEvent, getManageQuarterEvent, getManageWeekEvent,
    getManageYearEvent,
    PeriodicEvents,
    PeriodicNoteEventContext
} from 'src/components/context/periodic-note-event.context';
import { Day } from 'src/domain/models/day';
import {ManageEvent} from 'src/domain/events/manage.event';
import {Week} from 'src/domain/models/week';
import { Month } from 'src/domain/models/month';
import {Quarter} from 'src/domain/models/quarter';
import {Year} from 'src/domain/models/year';

describe('PeriodicNoteEventContext', () => {
    const manageDayEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as ManageEvent<Day>;
    const manageWeekEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as ManageEvent<Week>;
    const manageMonthEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as ManageEvent<Month>;
    const manageQuarterEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as ManageEvent<Quarter>;
    const manageYearEvent = {
        emitEvent: jest.fn(),
        onEvent: jest.fn()
    } as unknown as ManageEvent<Year>;

    const mockPeriodicEvents = {
        manageDayEvent: manageDayEvent,
        manageWeekEvent: manageWeekEvent,
        manageMonthEvent: manageMonthEvent,
        manageQuarterEvent: manageQuarterEvent,
        manageYearEvent: manageYearEvent
    } as jest.Mocked<PeriodicEvents>;

    it('provides the PeriodicEvents instances', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PeriodicNoteEventContext.Provider value={mockPeriodicEvents}>
                {children}
            </PeriodicNoteEventContext.Provider>
        );

        const dayResult = renderHook(() => getManageDayEvent(), { wrapper });
        const weekResult = renderHook(() => getManageWeekEvent(), { wrapper });
        const monthResult = renderHook(() => getManageMonthEvent(), { wrapper });
        const quarterResult = renderHook(() => getManageQuarterEvent(), { wrapper });
        const yearResult = renderHook(() => getManageYearEvent(), { wrapper });

        expect (dayResult.result.current).toBe(manageDayEvent);
        expect (weekResult.result.current).toBe(manageWeekEvent);
        expect (monthResult.result.current).toBe(manageMonthEvent);
        expect (quarterResult.result.current).toBe(manageQuarterEvent);
        expect (yearResult.result.current).toBe(manageYearEvent);
    });

    it('returns undefined for the manageDayEvent when no manageDayEvent is provided', () => {
        const periodicEvents = { ...mockPeriodicEvents, manageDayEvent: undefined };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PeriodicNoteEventContext.Provider value={periodicEvents}>
                {children}
            </PeriodicNoteEventContext.Provider>
        );

        const dayResult = renderHook(() => getManageDayEvent(), { wrapper });
        const weekResult = renderHook(() => getManageWeekEvent(), { wrapper });
        const monthResult = renderHook(() => getManageMonthEvent(), { wrapper });
        const quarterResult = renderHook(() => getManageQuarterEvent(), { wrapper });
        const yearResult = renderHook(() => getManageYearEvent(), { wrapper });

        expect (dayResult.result.current).toBeNull();
        expect (weekResult.result.current).toBe(manageWeekEvent);
        expect (monthResult.result.current).toBe(manageMonthEvent);
        expect (quarterResult.result.current).toBe(manageQuarterEvent);
        expect (yearResult.result.current).toBe(manageYearEvent);
    });

    it('returns null for the manageWeekEvent when no manageWeekEvent is provided', () => {
        const periodicEvents = { ...mockPeriodicEvents, manageWeekEvent: undefined };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PeriodicNoteEventContext.Provider value={periodicEvents}>
                {children}
            </PeriodicNoteEventContext.Provider>
        );

        const dayResult = renderHook(() => getManageDayEvent(), { wrapper });
        const weekResult = renderHook(() => getManageWeekEvent(), { wrapper });
        const monthResult = renderHook(() => getManageMonthEvent(), { wrapper });
        const quarterResult = renderHook(() => getManageQuarterEvent(), { wrapper });
        const yearResult = renderHook(() => getManageYearEvent(), { wrapper });

        expect (dayResult.result.current).toBe(manageDayEvent);
        expect (weekResult.result.current).toBeNull();
        expect (monthResult.result.current).toBe(manageMonthEvent);
        expect (quarterResult.result.current).toBe(manageQuarterEvent);
        expect (yearResult.result.current).toBe(manageYearEvent);
    });

    it('returns null for the manageMonthEvent when no manageMonthEvent is provided', () => {
        const periodicEvents = { ...mockPeriodicEvents, manageMonthEvent: undefined };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PeriodicNoteEventContext.Provider value={periodicEvents}>
                {children}
            </PeriodicNoteEventContext.Provider>
        );

        const dayResult = renderHook(() => getManageDayEvent(), { wrapper });
        const weekResult = renderHook(() => getManageWeekEvent(), { wrapper });
        const monthResult = renderHook(() => getManageMonthEvent(), { wrapper });
        const quarterResult = renderHook(() => getManageQuarterEvent(), { wrapper });
        const yearResult = renderHook(() => getManageYearEvent(), { wrapper });

        expect (dayResult.result.current).toBe(manageDayEvent);
        expect (weekResult.result.current).toBe(manageWeekEvent);
        expect (monthResult.result.current).toBeNull();
        expect (quarterResult.result.current).toBe(manageQuarterEvent);
        expect (yearResult.result.current).toBe(manageYearEvent);
    });

    it('returns null for the manageQuarterEvent when no manageQuarterEvent is provided', () => {
        const periodicEvents = { ...mockPeriodicEvents, manageQuarterEvent: undefined };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PeriodicNoteEventContext.Provider value={periodicEvents}>
                {children}
            </PeriodicNoteEventContext.Provider>
        );

        const dayResult = renderHook(() => getManageDayEvent(), { wrapper });
        const weekResult = renderHook(() => getManageWeekEvent(), { wrapper });
        const monthResult = renderHook(() => getManageMonthEvent(), { wrapper });
        const quarterResult = renderHook(() => getManageQuarterEvent(), { wrapper });
        const yearResult = renderHook(() => getManageYearEvent(), { wrapper });

        expect (dayResult.result.current).toBe(manageDayEvent);
        expect (weekResult.result.current).toBe(manageWeekEvent);
        expect (monthResult.result.current).toBe(manageMonthEvent);
        expect (quarterResult.result.current).toBeNull();
        expect (yearResult.result.current).toBe(manageYearEvent);
    });

    it('returns null for the manageYearEvent when no manageYearEvent is provided', () => {
        const periodicEvents = { ...mockPeriodicEvents, manageYearEvent: undefined };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PeriodicNoteEventContext.Provider value={periodicEvents}>
                {children}
            </PeriodicNoteEventContext.Provider>
        );

        const dayResult = renderHook(() => getManageDayEvent(), { wrapper });
        const weekResult = renderHook(() => getManageWeekEvent(), { wrapper });
        const monthResult = renderHook(() => getManageMonthEvent(), { wrapper });
        const quarterResult = renderHook(() => getManageQuarterEvent(), { wrapper });
        const yearResult = renderHook(() => getManageYearEvent(), { wrapper });

        expect (dayResult.result.current).toBe(manageDayEvent);
        expect (weekResult.result.current).toBe(manageWeekEvent);
        expect (monthResult.result.current).toBe(manageMonthEvent);
        expect (quarterResult.result.current).toBe(manageQuarterEvent);
        expect (yearResult.result.current).toBeNull();
    });

    it('returns null when no PeriodicEvent is provided', () => {
        const dayResult = renderHook(() => getManageDayEvent());
        const weekResult = renderHook(() => getManageWeekEvent());
        const monthResult = renderHook(() => getManageMonthEvent());
        const quarterResult = renderHook(() => getManageQuarterEvent());
        const yearResult = renderHook(() => getManageYearEvent());

        expect (dayResult.result.current).toBeNull();
        expect (weekResult.result.current).toBeNull();
        expect (monthResult.result.current).toBeNull();
        expect (quarterResult.result.current).toBeNull();
        expect (yearResult.result.current).toBeNull();
    });
});