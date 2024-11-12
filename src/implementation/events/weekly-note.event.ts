import {Event} from "src/domain/events/Event";
import {Week} from "src/domain/models/Week";

export class WeeklyNoteEvent extends Event<Week>  {
    private static eventName = "week";

    constructor() {
        super(WeeklyNoteEvent.eventName);
    }
}