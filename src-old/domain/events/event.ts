import {ModifierKey} from 'src-old/domain/models/modifier-key';

export type EventListenerWithModifierKey<T> = (value: T, modifierKey: ModifierKey) => void;
export type EventListener<T> = (value: T) => void;

export abstract class Event<T> {
    private readonly listeners = new Map<string, EventListener<T>>();
    private readonly listenersWithModifierKey = new Map<string, EventListenerWithModifierKey<T>>();

    public onEvent(key: string, listener: EventListener<T>): void {
        this.listeners.set(key, listener);
    }

    public onEventWithModifier(key: string, listener: EventListenerWithModifierKey<T>): void {
        this.listenersWithModifierKey.set(key, listener);
    }

    public emitEvent(value?: T, modifierKey: ModifierKey = ModifierKey.None): void {
        if (value) {
            this.listeners.forEach((listener) => listener(value));
            this.listenersWithModifierKey.forEach((listener) => listener(value, modifierKey));
        }
    }
}
