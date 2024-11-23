import {createContext, useContext} from 'react';
import {SelectDayEvent} from 'src/implementation/events/select-day.event';

export const SelectDayEventContext = createContext<SelectDayEvent | null>(null);
export const getSelectDayEvent = (): SelectDayEvent | null => {
    return useContext(SelectDayEventContext);
}