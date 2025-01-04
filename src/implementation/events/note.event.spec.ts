import { NoteEvent } from 'src/implementation/events/note.event';
import { Note } from 'src/domain/models/note';
import { ModifierKey } from 'src/domain/models/modifier-key';

describe('NoteEvent', () => {
    let event: NoteEvent;
    let note: Note;

    beforeEach(() => {
        event = new NoteEvent();
        note = {
            createdOn: new Date('2024-11-12'),
            name: 'My first note',
            path: 'Journaling/2024/My first note.md',
            properties: new Map(),
        };
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('NoteEvent', listener);

        event.emitEvent(note);

        expect(listener).toHaveBeenCalledWith(note);
    });

    it('should trigger event listeners only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('NoteEvent', listener);
        event.onEvent('NoteEvent', listener);

        event.emitEvent(note);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(note);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('NoteEvent', listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });

    it('should trigger event listeners with modifier key when an event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('NoteEvent', listener);

        event.emitEvent(note, ModifierKey.Shift);

        expect(listener).toHaveBeenCalledWith(note, ModifierKey.Shift);
    });

    it('should trigger event listeners with modifier key only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('NoteEvent', listener);
        event.onEventWithModifier('NoteEvent', listener);

        event.emitEvent(note, ModifierKey.Shift);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(note, ModifierKey.Shift);
    });

    it('should not trigger event listeners with modifier key when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('NoteEvent', listener);

        event.emitEvent(undefined, ModifierKey.Shift);

        expect(listener).not.toHaveBeenCalled();
    });
});