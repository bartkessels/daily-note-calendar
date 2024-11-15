export abstract class Event<T> {
    private listeners: ((value: T) => void)[] = [];

    public onEvent(listener: (value: T) => void): void {
        this.listeners.push(listener);
    }

    public emitEvent(value?: T): void {
        if (value) {
            this.listeners.forEach((listener) => listener(value));
        }
    }
}
