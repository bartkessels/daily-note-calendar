import {Day, DayOfWeek} from 'src/domain/models/day';
import {SelectDayEvent} from 'src/implementation/events/select-day.event';

describe('SelectDayNoteEvent', () => {
    let event: SelectDayEvent;
    let day: Day;

    beforeEach(() => {
        event = new SelectDayEvent();
        day = {
            dayOfWeek: DayOfWeek.Tuesday,
            date: new Date('2024-11-12'),
            name: '12',
        };
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('SelectDayEvent', listener);

        event.emitEvent(day);

        expect(listener).toHaveBeenCalledWith(day);
    });

    it('should trigger event listeners only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('SelectDayEvent', listener);
        event.onEvent('SelectDayEvent', listener);

        event.emitEvent(day);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(day);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('SelectDayEvent', listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });
});