import {ReactElement} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {Week} from 'src/domain/models/week';
import {createWeekUiModel, WeekUiModel} from 'src/components/week.ui-model';
import {WeekComponent} from 'src/components/calendar/week.component';
import 'src/extensions/extensions';
import {Event} from 'src/domain/events/event';
import {WeeklyNoteEventContext} from 'src/components/providers/weekly-note-event.context';

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

    it('displays days in the correct order', () => {
        week = {
            date: new Date(2023, 9, 1),
            weekNumber: 40,
            days: [
                {dayOfWeek: 6, date: new Date(2023, 9, 7), name: '7'},
                {dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2'},
                {dayOfWeek: 2, date: new Date(2023, 9, 3), name: '3'},
                {dayOfWeek: 3, date: new Date(2023, 9, 4), name: '4'},
                {dayOfWeek: 5, date: new Date(2023, 9, 6), name: '6'},
                {dayOfWeek: 4, date: new Date(2023, 9, 5), name: '5'},
            ]
        };
        uiModel = createWeekUiModel(week);

        render(setupContent(uiModel, mockWeeklyNoteEvent));

        const dayElements = screen.getAllByRole('cell').slice(1); // Skip the week number cell
        const dayNames = dayElements.map((element) => element.textContent).filter(s => s !== '');
        expect(dayNames).toEqual(['2', '3', '4', '5', '6', '7']);
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