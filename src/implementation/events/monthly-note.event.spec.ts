import {MonthlyNoteEvent} from 'src/implementation/events/monthly-note.event';
import {Month} from 'src/domain/models/month';

describe('MonthlyNoteEvent', () => {
    let event: MonthlyNoteEvent;
    let month: Month;

    beforeEach(() => {
        event = new MonthlyNoteEvent();
        month = {
            monthIndex: 11,
            year: 2024,
            name: 'November',
            number: 12,
            weeks: []
        };
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(month);

        expect(listener).toHaveBeenCalledWith(month);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });
});