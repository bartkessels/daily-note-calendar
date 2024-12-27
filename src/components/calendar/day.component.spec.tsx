import React, { ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DayComponent } from './day.component';
import { Day, DayOfWeek } from 'src/domain/models/day';
import { DayUiModel } from 'src/components/models/day.ui-model';
import { Event } from 'src/domain/events/event';
import { DailyNoteEventContext } from 'src/components/providers/daily-note-event.context';
import { SelectDayEventContext } from 'src/components/providers/select-day-event.context';
import { ModifierKey } from 'src/domain/models/modifier-key';

describe('DayComponent', () => {
    let day: Day;
    let uiModel: DayUiModel;
    const mockDailyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Day>;
    const mockSelectDayEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Day>;

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
        render(setupContent(uiModel, mockDailyNoteEvent, mockSelectDayEvent));

        fireEvent.click(screen.getByText('17'));

        expect(mockDailyNoteEvent.emitEvent).toHaveBeenCalledWith(day, ModifierKey.None);
    });

    it('emits the select day event when the day is clicked with shift key', () => {
        render(setupContent(uiModel, mockDailyNoteEvent, mockSelectDayEvent));

        fireEvent.click(screen.getByText('17'), { shiftKey: true });

        expect(mockSelectDayEvent.emitEvent).toHaveBeenCalledWith(day);
    });

    it('emits the daily note event with modifier key when the day is clicked with meta key', () => {
        render(setupContent(uiModel, mockDailyNoteEvent, mockSelectDayEvent));

        fireEvent.click(screen.getByText('17'), { metaKey: true });

        expect(mockDailyNoteEvent.emitEvent).toHaveBeenCalledWith(day, ModifierKey.Meta);
    });

    it('should set today is on the day if it is today', () => {
        const todayUiModel = { ...uiModel, isToday: true };

        render(setupContent(todayUiModel, mockDailyNoteEvent, mockSelectDayEvent));

        expect(screen.getByText('17').parentElement).toHaveAttribute('id', 'today');
    });

    it('should not set today is on the day if it is not today', () => {
        render(setupContent(uiModel, mockDailyNoteEvent, mockSelectDayEvent));

        expect(screen.getByText('17')).not.toHaveAttribute('id', 'today');
    });

    it('should set the selected class if the day is selected', () => {
        const selectedUiModel = { ...uiModel, isSelected: true };

        render(setupContent(selectedUiModel, mockDailyNoteEvent, mockSelectDayEvent));

        expect(screen.getByText('17').parentElement).toHaveClass('selected-day');
    });

    it('should not set the selected class if the day is not selected', () => {
        render(setupContent(uiModel, mockDailyNoteEvent, mockSelectDayEvent));

        expect(screen.getByText('17')).not.toHaveClass('selected-day');
    });

    it('should display an indicator if the day has a note', () => {
        const noteUiModel = { ...uiModel, hasNote: true };

        render(setupContent(noteUiModel, mockDailyNoteEvent, mockSelectDayEvent));

        expect(screen.getByText('17').parentElement).toHaveClass('has-note');
    });

    it('should not display an indicator if the day does not have a note', () => {
        render(setupContent(uiModel, mockDailyNoteEvent, mockSelectDayEvent));

        expect(screen.getByText('17')).not.toHaveClass('has-note');
    });
});

function setupContent(
    uiModel: DayUiModel,
    mockDailyNoteEvent: Event<Day>,
    mockSelectDayEvent: Event<Day>
): ReactElement {
    return (
        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
            <SelectDayEventContext.Provider value={mockSelectDayEvent}>
                <table>
                    <tbody>
                    <tr>
                        <DayComponent day={uiModel} />
                    </tr>
                    </tbody>
                </table>
            </SelectDayEventContext.Provider>
        </DailyNoteEventContext.Provider>
    );
}