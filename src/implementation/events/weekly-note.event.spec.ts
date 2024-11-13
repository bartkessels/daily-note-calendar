import {Week} from '../../domain/models/week';
import {WeeklyNoteEvent} from 'src/implementation/events/weekly-note.event';

describe('MonthlyNoteEvent', () => {
    let event: WeeklyNoteEvent;
    let week: Week;

    beforeEach(() => {
        event = new WeeklyNoteEvent();
        week = {
            weekNumber: 46,
            days: []
        }
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(week);

        expect(listener).toHaveBeenCalledWith(week);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });
});