import { Event } from 'src/domain/events/event';

export class OpenEvent implements Event {
    constructor(
        public readonly data: Date
    ) {
    }
}