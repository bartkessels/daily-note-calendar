export type EventListener<T> = (value: T) => void;

export abstract class Event<T> {
    private readonly listeners = new Map<string, EventListener<T>>();

    public onEvent(key: Function, listener: EventListener<T>): void {
        this.listeners.set(key.name, listener);
    }

    public emitEvent(value?: T): void {
        if (value) {
            this.listeners.forEach((listener) => listener(value));
        }
    }
}
