import {Month} from 'src/domain/models/month';
import {QuarterlyNoteEvent} from 'src/implementation/events/quarterly-note.event';

describe('QuarterlyNoteEvent', () => {
    let event: QuarterlyNoteEvent;
    let month: Month;

    beforeEach(() => {
        event = new QuarterlyNoteEvent();
        month = {
            monthIndex: 11,
            quarter: 4,
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