import {createContext, useContext} from 'react';
import {Event} from 'src/domain/events/event';
import {Day} from 'src/domain/models/day';

export const DailyNoteEventContext = createContext<Event<Day> | null>(null);
export const getDailyNoteEvent = (): Event<Day> | null => {
    return useContext(DailyNoteEventContext)
}
