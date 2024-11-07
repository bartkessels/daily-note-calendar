import { Event } from 'src/domain/events/event';

export interface EventListener<T extends Event> {
    onEventEmitted(event: T): void;
}
