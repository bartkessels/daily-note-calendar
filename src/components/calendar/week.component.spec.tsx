import {ReactElement} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {Week} from 'src/domain/models/week';
import {createWeekUiModel, WeekUiModel} from 'src/components/models/week.ui-model';
import {WeekComponent} from 'src/components/calendar/week.component';
import {Event} from 'src/domain/events/event';
import {WeeklyNoteEventContext} from 'src/components/providers/weekly-note-event.context';
import 'src/extensions/extensions';

describe('WeekComponent', () => {
    let week: Week;
    let uiModel: WeekUiModel;
    const mockWeeklyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Week>;

    beforeEach(() => {
        week = {
            date: new Date(2023, 9, 1),
            weekNumber: 40,
            days: [
                {dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2'},
                {dayOfWeek: 2, date: new Date(2023, 9, 3), name: '3'},
                {dayOfWeek: 3, date: new Date(2023, 9, 4), name: '4'},
                {dayOfWeek: 4, date: new Date(2023, 9, 5), name: '5'},
                {dayOfWeek: 5, date: new Date(2023, 9, 6), name: '6'},
                {dayOfWeek: 6, date: new Date(2023, 9, 7), name: '7'},
            ]
        };
        uiModel = createWeekUiModel(week);
    });

    it('displays all days of the week and the week number', () => {
        render(setupContent(uiModel, mockWeeklyNoteEvent));

        expect(screen.getByText('40')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('emits the weekly note event when a week is clicked', () => {
        render(setupContent(uiModel, mockWeeklyNoteEvent));

        fireEvent.click(screen.getByText('40'));
        expect(mockWeeklyNoteEvent.emitEvent).toHaveBeenCalledWith(week);
    });

    it('should display an indicator if the week has a note', () => {
        const noteUiModel = {...uiModel, hasNote: true};

        render(setupContent(noteUiModel, mockWeeklyNoteEvent));

        expect(screen.getByText('40')).toHaveClass('has-note');
    });

    it('should not display an indicator if the day does not have a note', () => {
        render(setupContent(uiModel, mockWeeklyNoteEvent));

        expect(screen.getByText('40')).not.toHaveClass('has-note');
    });
});

function setupContent(
    week: WeekUiModel,
    mockWeeklyNoteEvent: Event<Week>
): ReactElement {
    return (
        <table>
            <tbody>
                <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                    <WeekComponent week={week}/>
                </WeeklyNoteEventContext.Provider>
            </tbody>
        </table>
    );
}