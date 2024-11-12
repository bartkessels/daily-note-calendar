import {createContext, useContext} from "react";
import {Event} from "src/domain/events/Event";
import {Month} from "src/domain/models/Month";

export const MonthlyNoteEventProvider = createContext<Event<Month> | null>(null);
export const getMonthlyNoteEvent = (): Event<Month> | null => {
    return useContext(MonthlyNoteEventProvider)
}
