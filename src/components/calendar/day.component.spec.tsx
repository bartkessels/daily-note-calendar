import React, { ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DayComponent } from './day.component';
import { Day, DayOfWeek } from 'src/domain/models/day';
import { DayUiModel } from 'src/components/models/day.ui-model';
import { ModifierKey } from 'src/domain/models/modifier-key';
import {PeriodicNoteEventContext} from 'src/components/context/periodic-note-event.context';
import {ManageAction, ManageEvent} from 'src/domain/events/manage.event';

describe('DayComponent', () => {
    let day: Day;
    let uiModel: DayUiModel;
    const mockManageDayEvent = {
        onEvent: jest.fn(),
        onEventWithModifier: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as ManageEvent<Day>;

    beforeEach(() => {
        day = {
            date: new Date(2024, 11, 17),
            dayOfWeek: DayOfWeek.Tuesday,
            name: '17'
        };
        uiModel = {
            currentDay: day,
            isSelected: false,
            isToday: false,
            hasNote: false
        };
    });

    it('emits the daily note event when the day is clicked without modifier key', () => {
        render(setupContent(uiModel, mockManageDayEvent));

        fireEvent.click(screen.getByText('17'));

        expect(mockManageDayEvent.emitEvent).toHaveBeenCalledWith(ManageAction.Open, day, ModifierKey.None);
    });

    it('emits the select day event when the day is clicked with shift key', () => {
        render(setupContent(uiModel, mockManageDayEvent));

        fireEvent.click(screen.getByText('17'), { shiftKey: true });

        expect(mockManageDayEvent.emitEvent).toHaveBeenCalledWith(ManageAction.Preview, day);
    });

    it('emits the daily note event with modifier key when the day is clicked with meta key', () => {
        render(setupContent(uiModel, mockManageDayEvent));

        fireEvent.click(screen.getByText('17'), { metaKey: true });

        expect(mockManageDayEvent.emitEvent).toHaveBeenCalledWith(ManageAction.Open, day, ModifierKey.Meta);
    });

    it('should set today is on the day if it is today', () => {
        const todayUiModel = { ...uiModel, isToday: true };

        render(setupContent(todayUiModel, mockManageDayEvent));

        expect(screen.getByText('17').parentElement).toHaveAttribute('id', 'today');
    });

    it('should not set today is on the day if it is not today', () => {
        render(setupContent(uiModel, mockManageDayEvent));

        expect(screen.getByText('17').parentElement).not.toHaveAttribute('id', 'today');
    });

    it('should set the selected class if the day is selected', () => {
        const selectedUiModel = { ...uiModel, isSelected: true };

        render(setupContent(selectedUiModel, mockManageDayEvent));

        expect(screen.getByText('17').parentElement).toHaveClass('selected-day');
    });

    it('should not set the selected class if the day is not selected', () => {
        render(setupContent(uiModel, mockManageDayEvent));

        expect(screen.getByText('17').parentElement).not.toHaveClass('selected-day');
    });

    it('should display an indicator if the day has a note', () => {
        const noteUiModel = { ...uiModel, hasNote: true };

        render(setupContent(noteUiModel, mockManageDayEvent));

        expect(screen.getByText('17').parentElement).toHaveClass('has-note');
    });

    it('should not display an indicator if the day does not have a note', () => {
        render(setupContent(uiModel, mockManageDayEvent));

        expect(screen.getByText('17').parentElement).not.toHaveClass('has-note');
    });
});

function setupContent(
    uiModel: DayUiModel,
    mockDailyNoteEvent: ManageEvent<Day>
): ReactElement {
    return (
        <PeriodicNoteEventContext value={{
            manageDayEvent: mockDailyNoteEvent
        }}>
            <table>
                <tbody>
                <tr>
                    <DayComponent day={uiModel} />
                </tr>
                </tbody>
            </table>
        </PeriodicNoteEventContext>
    );
}