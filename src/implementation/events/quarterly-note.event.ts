import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';

export class QuarterlyNoteEvent extends Event<Month> {
    private static eventName = "daily-note-calendar-quarter";

    constructor() {
        super(QuarterlyNoteEvent.eventName);
    }
}