import {Event} from "src/domain/events/event";
import {Week} from "src/domain/models/week";

export class WeeklyNoteEvent extends Event<Week>  {
    private static eventName = "week";

    constructor() {
        super(WeeklyNoteEvent.eventName);
    }
}