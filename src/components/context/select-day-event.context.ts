import {createContext, useContext} from 'react';
import {Day} from 'src/domain/models/day';
import {Event} from 'src/domain/events/event';

export const SelectDayEventContext = createContext<Event<Day> | null>(null);
export const getSelectDayEvent = (): Event<Day> | null => {
    return useContext(SelectDayEventContext);
}