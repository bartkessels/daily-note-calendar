import {ManageEvent} from 'src/domain/events/manage.event';
import {Day} from 'src/domain/models/day';
import { Month } from 'src/domain/models/month';
import { Quarter } from 'src/domain/models/quarter';
import {Week} from 'src/domain/models/week';
import { Year } from 'src/domain/models/year';
import {createContext, useContext} from 'react';

export interface PeriodicEvents {
    manageDayEvent?: ManageEvent<Day>;
    manageWeekEvent?: ManageEvent<Week>;
    manageMonthEvent?: ManageEvent<Month>;
    manageQuarterEvent?: ManageEvent<Quarter>;
    manageYearEvent?: ManageEvent<Year>;
}

export const PeriodicNoteEventContext = createContext<PeriodicEvents | null>(null);

export function getManageDayEvent(): ManageEvent<Day> | null {
    return useContext(PeriodicNoteEventContext)?.manageDayEvent ?? null;
}

export function getManageWeekEvent(): ManageEvent<Week> | null {
    return useContext(PeriodicNoteEventContext)?.manageWeekEvent ?? null;
}

export function getManageMonthEvent(): ManageEvent<Month> | null {
    return useContext(PeriodicNoteEventContext)?.manageMonthEvent ?? null;
}

export function getManageQuarterEvent(): ManageEvent<Quarter> | null {
    return useContext(PeriodicNoteEventContext)?.manageQuarterEvent ?? null;
}

export function getManageYearEvent(): ManageEvent<Year> | null {
    return useContext(PeriodicNoteEventContext)?.manageYearEvent ?? null;
}