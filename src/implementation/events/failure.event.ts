import {Event} from 'src/domain/events/event';

export class FailureEvent extends Event<string> {
    private static eventName = "daily-note-calendar-failure";

    constructor() {
        super(FailureEvent.eventName);
    }
}