import {YearlyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {Year} from 'src/domain/models/year';

describe('YearlyNoteEvent', () => {
    let event: YearlyNoteEvent;
    let year: Year;

    beforeEach(() => {
        event = new YearlyNoteEvent();
        year = {
            year: 2024,
            name: '2024',
            months: []
        }
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(year);

        expect(listener).toHaveBeenCalledWith(year);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent(listener);

        event.emitEvent(undefined);

        expect(listener).not.toHaveBeenCalled();
    });
});