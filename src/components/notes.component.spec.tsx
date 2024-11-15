import React from 'react';
import {render, waitFor, screen} from '@testing-library/react';
import { NotesComponent } from './notes.component';
import { DailyNoteEventContext } from 'src/components/providers/daily-note-event.context';
import { Day } from 'src/domain/models/day';
import { Note } from 'src/domain/models/note';
import { Event } from 'src/domain/events/event';
import { jest } from '@jest/globals';
import {DailyNoteEvent} from 'src/implementation/events/daily-note.event';
import {DayNoteRepositoryContext} from 'src/components/providers/day-note-repository.context';

describe('NotesComponent', () => {
    let dailyNoteEvent: Event<Day>;
    let mockDayNoteRepository: any;

    beforeEach(() => {
        dailyNoteEvent = new DailyNoteEvent();
        mockDayNoteRepository = {
            getNotesCreatedOn: jest.fn(),
        };
    });

    it('should get all the notes from the repository when an event is emitted', () => {
        const day: Day = { dayOfWeek: 1, date: 2, completeDate: new Date(2023, 9, 2), name: '2' };

        render(
            <DayNoteRepositoryContext.Provider value={mockDayNoteRepository}>
                <DailyNoteEventContext.Provider value={dailyNoteEvent}>
                    <NotesComponent />
                </DailyNoteEventContext.Provider>
            </DayNoteRepositoryContext.Provider>
        );

        React.act(() => dailyNoteEvent.emitEvent(day));

        expect(mockDayNoteRepository.getNotesCreatedOn).toHaveBeenCalledWith(day);
    });

    it('should render notes when an event is emitted', async () => {
        const day: Day = { dayOfWeek: 1, date: 2, completeDate: new Date(2023, 9, 2), name: '2' };
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11), path: 'path/to/note2' },
        ];

        mockDayNoteRepository.getNotesCreatedOn.mockResolvedValueOnce(notes);

        render(
            <DayNoteRepositoryContext.Provider value={mockDayNoteRepository}>
                <DailyNoteEventContext.Provider value={dailyNoteEvent}>
                    <NotesComponent />
                </DailyNoteEventContext.Provider>
            </DayNoteRepositoryContext.Provider>
        );

        React.act(() => dailyNoteEvent.emitEvent(day));

        await waitFor(() => expect(screen.queryByRole('listitem')?.firstChild).not.toBeNull());
        for (const note of notes) {
            await waitFor(() => expect(screen.getByText(note.name)).toBeDefined());
            await waitFor(() => expect(screen.getByText(`Created at ${note.createdOn.toLocaleTimeString()}`)).toBeDefined());
            await waitFor(() => expect(screen.getByText(note.path)).toBeDefined());
        }
    });

    it('should render an empty list when no notes are available', async () => {
        const day: Day = { dayOfWeek: 1, date: 2, completeDate: new Date(2023, 9, 2), name: '2' };

        mockDayNoteRepository.getNotesCreatedOn.mockResolvedValueOnce([]);

        render(
            <DayNoteRepositoryContext.Provider value={mockDayNoteRepository}>
                <DailyNoteEventContext.Provider value={dailyNoteEvent}>
                    <NotesComponent />
                </DailyNoteEventContext.Provider>
            </DayNoteRepositoryContext.Provider>
        );

        React.act(() => dailyNoteEvent.emitEvent(day));

        await waitFor(() => expect(screen.queryByRole('listitem')).toBeNull());
    });
});