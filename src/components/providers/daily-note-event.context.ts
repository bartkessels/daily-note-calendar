import {createContext, useContext} from "react";
import {Day} from "src/domain/models/Day";
import {Event} from "src/domain/events/Event";

export const DailyNoteEventContext = createContext<Event<Day> | null>(null);
export const getDailyNoteEvent = (): Event<Day> | null => {
    return useContext(DailyNoteEventContext)
}