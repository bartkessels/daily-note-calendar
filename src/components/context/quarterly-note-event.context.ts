import {createContext, useContext} from 'react';
import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';

export const QuarterlyNoteEventContext = createContext<Event<Month> | null>(null);
export const getQuarterlyNoteEvent = (): Event<Month> | null => {
    return useContext(QuarterlyNoteEventContext);
}
