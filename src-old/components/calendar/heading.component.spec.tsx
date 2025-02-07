import React, {ReactElement} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {HeadingComponent} from './heading.component';
import {MonthUiModel} from 'src-old/components/models/month.ui-model';
import {Year} from 'src-old/domain/models/year';
import {Month} from 'src-old/domain/models/month';
import {PeriodicNoteEventContext} from 'src-old/components/context/periodic-note-event.context';
import {ManageAction, ManageEvent} from 'src-old/domain/events/manage.event';

describe('HeadingComponent', () => {
    let month: Month;
    let year: Year;
    let monthUiModel: MonthUiModel;
    const mockYearlyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as ManageEvent<Year>;
    const mockMonthlyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as ManageEvent<Month>;

    beforeEach(() => {
        month = {
            date: new Date(2024, 11),
            name: 'December',
            quarter: {
                date: new Date(2024, 11),
                quarter: 4,
                year: 2024
            },
            weeks: []
        };
        year = {
            date: new Date(2024, 0),
            name: '2024'
        };
        monthUiModel = {
            month: month,
            weeks: []
        };
    });

    it('renders the current month and year', () => {
        render(setupContent(
            monthUiModel,
            year,
            mockYearlyNoteEvent,
            mockMonthlyNoteEvent
        ));

        expect(screen.getByText('December')).toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('calls goToNextMonth when ChevronRight is clicked', () => {
        const navigateToNextMonth = jest.fn();
        render(setupContent(
            monthUiModel,
            year,
            mockYearlyNoteEvent,
            mockMonthlyNoteEvent,
            jest.fn(),
            navigateToNextMonth,
            jest.fn()
        ));

        fireEvent.click(document.querySelector('.lucide-chevron-right')!);

        expect(navigateToNextMonth).toHaveBeenCalled();
    });

    it('calls goToPreviousMonth when ChevronLeft is clicked', () => {
        const navigateToPreviousMonth = jest.fn();
        render(setupContent(
            monthUiModel,
            year,
            mockYearlyNoteEvent,
            mockMonthlyNoteEvent,
            navigateToPreviousMonth,
            jest.fn(),
            jest.fn()
        ));

        fireEvent.click(document.querySelector('.lucide-chevron-left')!);

        expect(navigateToPreviousMonth).toHaveBeenCalled();
    });

    it('calls goToCurrentMonth when CalendarHeart is clicked', () => {
        const navigateToCurrentMonth = jest.fn();
        render(setupContent(
            monthUiModel,
            year,
            mockYearlyNoteEvent,
            mockMonthlyNoteEvent,
            jest.fn(),
            jest.fn(),
            navigateToCurrentMonth
        ));

        fireEvent.click(document.querySelector('.lucide-calendar-heart')!);

        expect(navigateToCurrentMonth).toHaveBeenCalled();
    });

    it('emits the monthly note event when the month is clicked', () => {
        render(setupContent(
            monthUiModel,
            year,
            mockYearlyNoteEvent,
            mockMonthlyNoteEvent
        ));

        fireEvent.click(screen.getByText('December'));

        expect(mockMonthlyNoteEvent.emitEvent).toHaveBeenCalledWith(ManageAction.Open, month);
    });

    it('emits the yearly note event when the year is clicked', () => {
        render(setupContent(
            monthUiModel,
            year,
            mockYearlyNoteEvent,
            mockMonthlyNoteEvent
        ));

        fireEvent.click(screen.getByText('2024'));

        expect(mockYearlyNoteEvent.emitEvent).toHaveBeenCalledWith(ManageAction.Open, year);
    });
});

function setupContent(
    month: MonthUiModel,
    year: Year,
    mockYearlyNoteEvent: ManageEvent<Year>,
    mockMonthlyNoteEvent: ManageEvent<Month>,
    navigateToPreviousMonth: () => void = jest.fn(),
    navigateToNextMonth: () => void = jest.fn(),
    navigateToCurrentMonth: () => void = jest.fn()
): ReactElement {
    return (
        <PeriodicNoteEventContext value={{manageYearEvent: mockYearlyNoteEvent, manageMonthEvent: mockMonthlyNoteEvent}}>
            <HeadingComponent
                month={month}
                year={year}
                navigateToPreviousMonth={navigateToPreviousMonth}
                navigateToNextMonth={navigateToNextMonth}
                navigateToCurrentMonth={navigateToCurrentMonth}
            />
        </PeriodicNoteEventContext>
    );
}
