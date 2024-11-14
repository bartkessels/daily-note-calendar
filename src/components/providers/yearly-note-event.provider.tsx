import {createContext, useContext} from 'react';
import {Event} from 'src/domain/events/event';
import {Year} from 'src/domain/models/year';

export const YearlyNoteEventContext = createContext<Event<Year> | null>(null);
export const getYearlyNoteEvent = (): Event<Year> | null => {
    return useContext(YearlyNoteEventContext)
}
