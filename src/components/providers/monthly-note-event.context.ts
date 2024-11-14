import {createContext, useContext} from 'react';
import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';

export const MonthlyNoteEventContext = createContext<Event<Month> | null>(null);
export const getMonthlyNoteEvent = (): Event<Month> | null => {
    return useContext(MonthlyNoteEventContext)
}
