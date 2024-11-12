import {Day} from "src/domain/models/Day";
import {Event} from "src/domain/events/Event";

export class DailyNoteEvent extends Event<Day>  {
    private static eventName = "day";

    constructor() {
        super(DailyNoteEvent.eventName);
    }
}