import { NoteManageEvent } from './note.manage-event';
import { Note } from 'src-old/domain/models/note';
import { ManageAction } from 'src-old/domain/events/manage.event';
import { ModifierKey } from 'src-old/domain/models/modifier-key';

describe('NoteManageEvent', () => {
    let event: NoteManageEvent;
    let note: Note;

    beforeEach(() => {
        event = new NoteManageEvent();
        note = {
            name: 'Test Note',
            createdOn: new Date('2024-11-12'),
            path: 'path/to/note',
            properties: new Map()
        };
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('NoteManageEvent', listener);

        event.emitEvent(ManageAction.Delete, note);

        expect(listener).toHaveBeenCalledWith(note, ManageAction.Delete);
    });

    it('should trigger event listeners only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('NoteManageEvent', listener);
        event.onEvent('NoteManageEvent', listener);

        event.emitEvent(ManageAction.Open, note);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(note, ManageAction.Open);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('NoteManageEvent', listener);

        event.emitEvent(ManageAction.Delete, undefined);

        expect(listener).not.toHaveBeenCalled();
    });

    it('should trigger event listeners with modifier key when an event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('NoteManageEvent', listener);

        event.emitEvent(ManageAction.Preview, note, ModifierKey.Shift);

        expect(listener).toHaveBeenCalledWith(note, ManageAction.Preview, ModifierKey.Shift);
    });

    it('should trigger event listeners with modifier key only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('NoteManageEvent', listener);
        event.onEventWithModifier('NoteManageEvent', listener);

        event.emitEvent(ManageAction.Delete, note, ModifierKey.Shift);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(note, ManageAction.Delete, ModifierKey.Shift);
    });

    it('should not trigger event listeners with modifier key when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('NoteManageEvent', listener);

        event.emitEvent(ManageAction.Open, undefined, ModifierKey.Shift);

        expect(listener).not.toHaveBeenCalled();
    });
});