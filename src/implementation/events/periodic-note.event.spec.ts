import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {ModifierKey} from 'src/domain/models/modifier-key';

describe('PeriodicNoteEvent', () => {
    let event: PeriodicNoteEvent<Day>;
    let day: Day;

    beforeEach(() => {
        event = new PeriodicNoteEvent<Day>();
        day = {
            dayOfWeek: DayOfWeek.Tuesday,
            date: new Date('2024-11-12'),
            name: '12',
        };
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('PeriodicNoteEvent', listener);

        event.emitEvent(day);

        expect(listener).toHaveBeenCalledWith(day);
    });

    it('should trigger event listeners only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('PeriodicNoteEvent', listener);
        event.onEvent('PeriodicNoteEvent', listener);

        event.emitEvent(day);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(day);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('PeriodicNoteEvent', listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });

    it('should trigger event listeners with modifier key when an event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('PeriodicNoteEvent', listener);

        event.emitEvent(day, ModifierKey.Shift);

        expect(listener).toHaveBeenCalledWith(day, ModifierKey.Shift);
    });

    it('should trigger event listeners with modifier key only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('PeriodicNoteEvent', listener);
        event.onEventWithModifier('PeriodicNoteEvent', listener);

        event.emitEvent(day, ModifierKey.Shift);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(day, ModifierKey.Shift);
    });

    it('should not trigger event listeners with modifier key when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('PeriodicNoteEvent', listener);

        event.emitEvent(undefined, ModifierKey.Shift);

        expect(listener).not.toHaveBeenCalled();
    });
});