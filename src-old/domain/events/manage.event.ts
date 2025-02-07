import {ModifierKey} from 'src-old/domain/models/modifier-key';

type EventListener<T> = (value: T, action: ManageAction) => void;
type EventListenerWithModifier<T> = (value: T, action: ManageAction, modifierKey: ModifierKey) => void;

export abstract class ManageEvent<T> {
    private readonly listeners = new Map<string, EventListener<T>>();
    private readonly listenersWithModifierKey = new Map<string, EventListenerWithModifier<T>>();

    public onEvent(key: string, listener: EventListener<T>): void {
        this.listeners.set(key, listener);
    }

    public onEventWithModifier(key: string, listener: EventListenerWithModifier<T>): void {
        this.listenersWithModifierKey.set(key, listener);
    }

    public emitEvent(action: ManageAction, value?: T, modifierKey: ModifierKey = ModifierKey.None): void {
        if (value) {
            this.listeners.forEach(listener => listener(value, action));
            this.listenersWithModifierKey.forEach(listener => listener(value, action, modifierKey));
        }
    }
}

export enum ManageAction {
    Open,
    Preview,
    Delete
}