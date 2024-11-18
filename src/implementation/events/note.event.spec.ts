import {NoteEvent} from 'src/implementation/events/note.event';
import {Note} from 'src/domain/models/note';

describe('NoteEvent', () => {
    let event: NoteEvent;
    let note: Note;

    beforeEach(() => {
        event = new NoteEvent();
        note = {
            createdOn: new Date('2024-11-12'),
            name: 'My first note',
            path: 'Journaling/2024/My first note.md'
        };
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(note);

        expect(listener).toHaveBeenCalledWith(note);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });
});