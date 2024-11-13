import {DailyNoteEvent} from 'src/implementation/events/daily-note.event';
import {Day, DayOfWeek} from '../../domain/models/day';

describe('DailyNoteEvent', () => {
    let event: DailyNoteEvent;
    let day: Day;

    beforeEach(() => {
        event = new DailyNoteEvent();
        day = {
            dayOfWeek: DayOfWeek.Tuesday,
            date: 12,
            name: '12',
            completeDate: new Date('2024-11-12')
        };
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(day);

        expect(listener).toHaveBeenCalledWith(day);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });
});