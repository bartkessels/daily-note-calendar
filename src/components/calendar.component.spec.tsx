import React from 'react';
import {screen, fireEvent, render} from '@testing-library/react';
import '@testing-library/jest-dom';
import { CalendarComponent } from './calendar.component';
import { QuarterlyNoteEventContext } from 'src/components/providers/quarterly-note-event.context';
import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {Week} from 'src/domain/models/week';
import { CalendarViewModel } from './viewmodels/calendar.view-model';
import {useCalendarViewModel} from 'src/components/viewmodels/calendar.view-model.provider';
import {createCalendarUiModel} from 'src/components/models/calendar.ui-model';
import 'src/extensions/extensions';

jest.mock('src/components/viewmodels/calendar.view-model.provider');

describe('CalendarComponent', () => {
    let mockViewModel: CalendarViewModel;
    const mockQuarterlyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Month>;

    beforeEach(() => {
        const week: Week = {
            date: new Date(2023, 9, 1),
            weekNumber: '40',
            days: [
                {dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2'},
                {dayOfWeek: 2, date: new Date(2023, 9, 3), name: '3'},
                {dayOfWeek: 3, date: new Date(2023, 9, 4), name: '4'},
                {dayOfWeek: 4, date: new Date(2023, 9, 5), name: '5'},
                {dayOfWeek: 5, date: new Date(2023, 9, 6), name: '6'},
                {dayOfWeek: 6, date: new Date(2023, 9, 7), name: '7'},
            ]
        };
        const month: Month = {
            date: new Date(2024, 11),
            name: 'December',
            quarter: 4,
            weeks: [week]
        };
        const year: Year = {
            date: new Date(2024, 0),
            name: '2024',
            months: [month]
        };
        const uiModel = createCalendarUiModel(year, month);

        mockViewModel = {
            viewState: {
                uiModel: uiModel
            },
            navigateToPreviousMonth: jest.fn(),
            navigateToCurrentMonth: jest.fn(),
            navigateToNextMonth: jest.fn()
        };

        (useCalendarViewModel as jest.Mock).mockReturnValue(mockViewModel);
    });

    it('displays the current month and year', () => {
        render(setupContent(mockQuarterlyNoteEvent));

        expect(screen.getByText('December')).toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('displays the days of the week starting with Sunday when startWeekOnMonday is false', () => {
        mockViewModel.viewState.uiModel!.startWeekOnMonday = false;
        render(setupContent(mockQuarterlyNoteEvent));

        const headers = screen.getAllByRole('columnheader');
        expect(headers[1]).toHaveTextContent('Sun');
        expect(headers[2]).toHaveTextContent('Mon');
        expect(headers[3]).toHaveTextContent('Tue');
        expect(headers[4]).toHaveTextContent('Wed');
        expect(headers[5]).toHaveTextContent('Thu');
        expect(headers[6]).toHaveTextContent('Fri');
        expect(headers[7]).toHaveTextContent('Sat');
    });

    it('displays the days of the week starting with Monday when startWeekOnMonday is true', () => {
        mockViewModel.viewState.uiModel!.startWeekOnMonday = true;
        render(setupContent(mockQuarterlyNoteEvent));

        const headers = screen.getAllByRole('columnheader');
        expect(headers[1]).toHaveTextContent('Mon');
        expect(headers[2]).toHaveTextContent('Tue');
        expect(headers[3]).toHaveTextContent('Wed');
        expect(headers[4]).toHaveTextContent('Thu');
        expect(headers[5]).toHaveTextContent('Fri');
        expect(headers[6]).toHaveTextContent('Sat');
        expect(headers[7]).toHaveTextContent('Sun');
    });

    it('calls navigateToPreviousMonth when the previous month button is clicked', () => {
        render(setupContent(mockQuarterlyNoteEvent));

        fireEvent.click(document.querySelector('.lucide-chevron-left')!);
        expect(mockViewModel.navigateToPreviousMonth).toHaveBeenCalled();
    });

    it('calls navigateToCurrentMonth when the current month button is clicked', () => {
        render(setupContent(mockQuarterlyNoteEvent));

        fireEvent.click(document.querySelector('.lucide-calendar-heart')!);
        expect(mockViewModel.navigateToCurrentMonth).toHaveBeenCalled();
    });

    it('calls navigateToNextMonth when the next month button is clicked', () => {
        render(setupContent(mockQuarterlyNoteEvent));

        fireEvent.click(document.querySelector('.lucide-chevron-right')!);
        expect(mockViewModel.navigateToNextMonth).toHaveBeenCalled();
    });

    it('displays the quarter of the current month', () => {
        render(setupContent(mockQuarterlyNoteEvent));

        expect(screen.getByText('Q4')).toBeInTheDocument();
    });

    it('emits the quarterly note event when the quarter is clicked', () => {
        render(setupContent(mockQuarterlyNoteEvent));

        fireEvent.click(screen.getByText('Q4'));
        expect(mockQuarterlyNoteEvent.emitEvent).toHaveBeenCalledWith(mockViewModel.viewState.uiModel?.currentMonth?.month);
    });

    it('displays all days and week numbers of the current month grouped into weeks', () => {
        render(setupContent(mockQuarterlyNoteEvent));

        expect(screen.getByText('40')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
    });
});

function setupContent(
    quarterlyNoteEvent: Event<Month>
): React.ReactElement {
    return (
        <QuarterlyNoteEventContext.Provider value={quarterlyNoteEvent}>
            <CalendarComponent />
        </QuarterlyNoteEventContext.Provider>
    );
}