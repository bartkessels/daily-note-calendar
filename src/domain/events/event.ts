import {EventEmitter} from "events";

export abstract class Event<T> extends EventEmitter {
    protected constructor(private eventName: string) {
        super();
    }

    public onEvent(listener: (value: T) => void): void {
        this.on(this.eventName, listener);
    }

    public emitEvent(value?: T): void {
        if (value) {
            this.emit(this.eventName, value);
        }
    }
}
