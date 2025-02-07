import {ManageAction} from 'src-old/domain/events/manage.event';
import {ModifierKey} from 'src-old/domain/models/modifier-key';
import {PeriodicManageEvent} from 'src-old/implementation/events/periodic.manage-event';
import {Day, DayOfWeek} from 'src-old/domain/models/day';

describe('PeriodicManageEvent', () => {
    let event: PeriodicManageEvent<Day>;
    let day: Day;

    beforeEach(() => {
        event = new PeriodicManageEvent<Day>();
        day = {
            date: new Date('2024-11-12'),
            dayOfWeek: DayOfWeek.Wednesday,
            name: '12'
        };
    });

    it('should trigger event listeners when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('PeriodicManageEvent', listener);

        event.emitEvent(ManageAction.Delete, day);

        expect(listener).toHaveBeenCalledWith(day, ManageAction.Delete);
    });

    it('should trigger event listeners only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('PeriodicManageEvent', listener);
        event.onEvent('PeriodicManageEvent', listener);

        event.emitEvent(ManageAction.Open, day);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(day, ManageAction.Open);
    });

    it('should not trigger event listeners when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEvent('PeriodicManageEvent', listener);

        event.emitEvent(ManageAction.Delete, undefined);

        expect(listener).not.toHaveBeenCalled();
    });

    it('should trigger event listeners with modifier key when an event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('PeriodicManageEvent', listener);

        event.emitEvent(ManageAction.Preview, day, ModifierKey.Shift);

        expect(listener).toHaveBeenCalledWith(day, ManageAction.Preview, ModifierKey.Shift);
    });

    it('should trigger event listeners with modifier key only once when an event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('PeriodicManageEvent', listener);
        event.onEventWithModifier('PeriodicManageEvent', listener);

        event.emitEvent(ManageAction.Delete, day, ModifierKey.Shift);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(day, ManageAction.Delete, ModifierKey.Shift);
    });

    it('should not trigger event listeners with modifier key when an undefined event is emitted', () => {
        const listener = jest.fn();
        event.onEventWithModifier('PeriodicManageEvent', listener);

        event.emitEvent(ManageAction.Open, undefined, ModifierKey.Shift);

        expect(listener).not.toHaveBeenCalled();
    });
});