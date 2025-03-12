import {DisplayInCalendarCommandHandler} from 'src/presentation/command-handlers/display-in-calendar.command-handler';
import { mockNoteManager } from 'src/test-helpers/manager.mocks';
import {mockNoteManagerFactory} from 'src/test-helpers/factory.mocks';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {Note} from 'src/domain/models/note.model';
import {Period, PeriodType} from 'src/domain/models/period.model';

describe('DisplayInCalendarCommandHandler', () => {
    let commandHandler: DisplayInCalendarCommandHandler;
    const noteManager = mockNoteManager;
    const viewModel = mockCalendarViewModel;
    const activeNote = <Note> {
        createdOn: <Period> {
            name: '03',
            date: new Date(2023, 9, 3),
            type: PeriodType.Day
        },
        name: 'My Note',
        path: 'path/to/note',
        properties: new Map<string, string>()
    };

    beforeEach(() => {
        const noteManagerFactory = mockNoteManagerFactory(noteManager);

        commandHandler = new DisplayInCalendarCommandHandler(noteManagerFactory, viewModel);
    });

    describe('execute', () => {
        it('should select the period based on the createdOn property', async () => {
            // Arrange
            noteManager.getActiveNote.mockResolvedValue(activeNote);

            // Act
            await commandHandler.execute();

            // Assert
            expect(noteManager.getActiveNote).toHaveBeenCalled();
            expect(viewModel.selectPeriod).toHaveBeenCalledWith(activeNote.createdOn);
        });
    });
});