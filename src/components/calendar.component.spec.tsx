import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CalendarComponent } from 'src/components/calendar.component';
import { DateManager } from 'src/domain/managers/date.manager';
import { FileManager } from 'src/domain/managers/file.manager';
import 'src/extensions/extensions';
import { DateManagerContext } from './providers/datemanager.provider';
import { FileManagerContext } from './providers/filemanager.provider';

const mockDateManager = {
    getCurrentMonth: jest.fn(),
    getNextMonth: jest.fn(),
    getPreviousMonth: jest.fn()
} as DateManager;

const mockFileManager = {
    tryOpenWeeklyNote: jest.fn(),
    tryOpenDailyNote: jest.fn()
} as FileManager;

describe('CalendarComponent', () => {
    beforeEach(() => {
        (mockDateManager.getCurrentMonth as jest.Mock).mockReturnValue({
            name: 'October',
            year: 2023,
            weeks: [
                {
                    weekNumber: 40,
                    days: [
                        { dayOfWeek: 1, completeDate: new Date(2023, 9, 2), name: '2' },
                        { dayOfWeek: 2, completeDate: new Date(2023, 9, 3), name: '3' },
                        { dayOfWeek: 3, completeDate: new Date(2023, 9, 4), name: '4' },
                        { dayOfWeek: 4, completeDate: new Date(2023, 9, 5), name: '5' },
                        { dayOfWeek: 5, completeDate: new Date(2023, 9, 6), name: '6' },
                        { dayOfWeek: 6, completeDate: new Date(2023, 9, 7), name: '7' },
                    ]
                }
            ]
        });
    });

    it('renders the current month and year', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <FileManagerContext.Provider value={mockFileManager}>
                    <CalendarComponent />
                </FileManagerContext.Provider>
            </DateManagerContext.Provider>
        );

        expect(screen.getByText('October 2023')).toBeDefined();
    });

    it('calls goToNextMonth when ChevronRight is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <FileManagerContext.Provider value={mockFileManager}>
                    <CalendarComponent />
                </FileManagerContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(document.querySelector('.lucide-chevron-right')!);
        expect(mockDateManager.getNextMonth).toHaveBeenCalled();
    });

    it('calls goToPreviousMonth when ChevronLeft is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <FileManagerContext.Provider value={mockFileManager}>
                    <CalendarComponent />
                </FileManagerContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(document.querySelector('.lucide-chevron-left')!);
        expect(mockDateManager.getPreviousMonth).toHaveBeenCalled();
    });

    it('calls goToCurrentMonth when CalendarHeart is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <FileManagerContext.Provider value={mockFileManager}>
                    <CalendarComponent />
                </FileManagerContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(document.querySelector('.lucide-calendar-heart')!);
        expect(mockDateManager.getCurrentMonth).toHaveBeenCalled();
    });

    it('calls onDayClicked when a day is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <FileManagerContext.Provider value={mockFileManager}>
                    <CalendarComponent />
                </FileManagerContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(screen.getByText('2'));
        expect(mockFileManager.tryOpenDailyNote).toHaveBeenCalledWith(new Date(2023, 9, 2));
    });

    it('calls onWeekClicked when a week is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <FileManagerContext.Provider value={mockFileManager}>
                    <CalendarComponent />
                </FileManagerContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(screen.getByText('40'));
        expect(mockFileManager.tryOpenWeeklyNote).toHaveBeenCalledWith(new Date(2023, 9, 2));
    });
});