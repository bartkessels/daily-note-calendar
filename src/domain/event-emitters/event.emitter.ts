import { Event } from 'src/domain/events/event';
import { EventListener } from 'src/domain/event-emitters/event.listener';

export abstract class EventEmitter<T extends Event> {
    private listeners: EventListener<T>[] = [];

    registerListener(listener: EventListener<T>): void {
        this.listeners.push(listener);
    }

    deregisterListener(listener: EventListener<T>): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    emitEvent(event: T): void {
        this.listeners.forEach(listener => listener.onEventEmitted(event));
    }
}