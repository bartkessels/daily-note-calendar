import React, {ReactElement} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {DayComponent} from './day.component';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {DayUiModel} from 'src/components/models/day.ui-model';
import {Event} from 'src/domain/events/event';
import {DailyNoteEventContext} from 'src/components/providers/daily-note-event.context';

describe('DayComponent', () => {
    let day: Day;
    let uiModel: DayUiModel;
    const mockDailyNoteEvent = {
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

    it('emits the daily note event when the day is clicked', () => {
        render(setupContent(uiModel, mockDailyNoteEvent));

        fireEvent.click(screen.getByText('17'));

        expect(mockDailyNoteEvent.emitEvent).toHaveBeenCalledWith(day);
    });

    it('should set today is on the day if it is today', () => {
        const todayUiModel = {...uiModel, isToday: true};

        render(setupContent(todayUiModel, mockDailyNoteEvent));

        expect(screen.getByText('17')).toHaveAttribute('id', 'today');
    });

    it('should not set today is on the day if it is not today', () => {
        render(setupContent(uiModel, mockDailyNoteEvent));

        expect(screen.getByText('17')).not.toHaveAttribute('id', 'today');
    });

    it('should set the selected class if the day is selected', () => {
        const selectedUiModel = {...uiModel, isSelected: true};

        render(setupContent(selectedUiModel, mockDailyNoteEvent));

        expect(screen.getByText('17')).toHaveClass('selected-day');
    });

    it('should not set the selected class if the day is not selected', () => {
        render(setupContent(uiModel, mockDailyNoteEvent));

        expect(screen.getByText('17')).not.toHaveClass('selected-day');
    });

    it('should display an indicator if the day has a note', () => {
        const noteUiModel = {...uiModel, hasNote: true};

        render(setupContent(noteUiModel, mockDailyNoteEvent));

        expect(screen.getByText('17')).toHaveClass('has-note');
    });

    it('should not display an indicator if the day does not have a note', () => {
        render(setupContent(uiModel, mockDailyNoteEvent));

        expect(screen.getByText('17')).not.toHaveClass('has-note');
    });
});

function setupContent(
    uiModel: DayUiModel,
    mockDailyNoteEvent: Event<Day>
): ReactElement {
    return (
        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
            <table>
                <tbody>
                <tr>
                    <DayComponent day={uiModel}/>
                </tr>
                </tbody>
            </table>
        </DailyNoteEventContext.Provider>
    );
}