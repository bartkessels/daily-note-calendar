import {Note} from 'src/domain/models/note';
import {RefreshNotesEvent} from 'src/implementation/events/refresh-notes.event';

describe('RefreshNotesEvent', () => {
    let event: RefreshNotesEvent;
    let notes: Note[];

    beforeEach(() => {
        event = new RefreshNotesEvent();
        notes = [{
            createdOn: new Date('2024-11-12'),
            name: 'My first note',
            path: 'Journaling/2024/My first note.md'
        }];
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(RefreshNotesEvent, listener);

        event.emitEvent(notes);

        expect(listener).toHaveBeenCalledWith(notes);
    });

    it('should trigger event listeners only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(RefreshNotesEvent, listener);
        event.onEvent(RefreshNotesEvent, listener);

        event.emitEvent(notes);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(notes);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(RefreshNotesEvent, listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });
});