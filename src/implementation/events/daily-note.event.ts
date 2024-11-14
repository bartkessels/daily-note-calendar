import {Day} from 'src/domain/models/day';
import {Event} from 'src/domain/events/event';

export class DailyNoteEvent extends Event<Day>  {
    private static eventName = "day";

    constructor() {
        super(DailyNoteEvent.eventName);
    }
}