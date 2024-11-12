import {createContext, useContext} from "react";
import {Event} from "src/domain/events/Event";
import {Week} from "src/domain/models/Week";

export const WeeklyNoteEventProvider = createContext<Event<Week> | null>(null);
export const getWeeklyNoteEvent = (): Event<Week> | null => {
    return useContext(WeeklyNoteEventProvider)
}
