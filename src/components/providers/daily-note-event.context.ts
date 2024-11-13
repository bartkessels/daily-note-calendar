import {createContext, useContext} from "react";
import {Day} from "src/domain/models/day";
import {Event} from "src/domain/events/event";

export const DailyNoteEventContext = createContext<Event<Day> | null>(null);
export const getDailyNoteEvent = (): Event<Day> | null => {
    return useContext(DailyNoteEventContext)
}
