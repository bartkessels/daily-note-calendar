import {ModifierKey} from 'src/domain/models/modifier-key';

export type EventListenerWithModifierKey<T> = (value: T, modifierKey: ModifierKey) => Promise<void>;
export type EventListener<T> = (value: T) => Promise<void>;

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
            const listenerPromises = Array.from(this.listeners.values()).map(listener => listener(value));
            const listenerWithModifierPromises = Array.from(this.listenersWithModifierKey.values()).map(listener => listener(value, modifierKey));
            Promise.all([...listenerPromises, ...listenerWithModifierPromises]).catch();
        }
    }
}
