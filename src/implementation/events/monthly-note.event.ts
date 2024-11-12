import {Event} from "src/domain/events/Event";
import {Month} from "src/domain/models/Month";

export class MonthlyNoteEvent extends Event<Month>  {
    private static eventName = "month";

    constructor() {
        super(MonthlyNoteEvent.eventName);
    }
}