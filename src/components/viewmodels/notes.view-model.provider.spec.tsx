import {DateManagerContext} from 'src/components/context/date-manager.context';
import {Event} from 'src/domain/events/event';
import {DateManager} from 'src/domain/managers/date.manager';
import {Enhancer} from 'src/domain/enhancers/enhancer';
import React from 'react';
import {renderHook, waitFor} from '@testing-library/react';
import {useCalendarViewModel} from 'src/components/viewmodels/calendar.view-model.provider';
import {Note} from 'src/domain/models/note';
import {NoteUiModel} from 'src/components/models/note.ui-model';
import {RefreshNotesEvent} from 'src/implementation/events/refresh-notes.event';
import {NotesEnhancerContext} from 'src/components/context/notes-enhancer.context';
import {RefreshNotesEventContext} from 'src/components/context/refresh-notes-event.context';

describe('useNotesViewModel', () => {
    const mockDateManager = {
        getCurrentMonth: jest.fn(),
        getCurrentYear: jest.fn(),
        getCurrentDay: jest.fn(),
        getMonth: jest.fn(),
        getPreviousMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getYear: jest.fn()
    } as jest.Mocked<DateManager>;

    const mockEnhancer = {
        withValue: jest.fn(),
        withStep: jest.fn(),
        build: jest.fn()
    } as unknown as jest.Mocked<Enhancer<NoteUiModel[]>>;

    let refreshNotesEvent: Event<Note[]>;

    beforeEach(() => {
        mockEnhancer.withValue.mockReturnValue(mockEnhancer);

        refreshNotesEvent = new RefreshNotesEvent();
    });

    const setup = () => {
        return renderHook(() => useCalendarViewModel(), {
            wrapper: ({children}: { children: React.ReactNode }) => (
                <DateManagerContext.Provider value={mockDateManager}>
                    <NotesEnhancerContext.Provider value={mockEnhancer}>
                        <RefreshNotesEventContext.Provider value={refreshNotesEvent}>
                            {children}
                        </RefreshNotesEventContext.Provider>
                    </NotesEnhancerContext.Provider>
                </DateManagerContext.Provider>
            )
        });
    };

    it('should call setViewState when the view state is updated', async () => {
        const setViewStateSpy = jest.spyOn(React, 'useState');
        const setViewState = jest.fn();
        setViewStateSpy.mockReturnValue([undefined, setViewState]);

        setup();

        await waitFor(() => {
            expect(setViewState).toHaveBeenCalled();
        });
    });
});