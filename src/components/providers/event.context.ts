import {createContext, useContext} from 'react';
import {Event} from 'src/domain/events/event';

export const EventContext = <T>() => createContext<Event<T> | null>(null);
export const getEvent = <T>(): Event<T> | null => {
    return useContext(EventContext<T>());
}