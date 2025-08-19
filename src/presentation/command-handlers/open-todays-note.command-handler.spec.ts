import {OpenTodaysNoteCommandHandler} from 'src/presentation/command-handlers/open-todays-note.command-handler';
import {mockDateManager} from 'src/test-helpers/manager.mocks';
import {mockCalendarViewModel, mockPeriodNoteViewModel} from 'src/test-helpers/view-model.mocks';
import {mockDateManagerFactory} from 'src/test-helpers/factory.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {ModifierKey} from 'src/domain/models/modifier-key';

describe('OpenTodaysNoteCommandHandler', () => {
    let commandHandler: OpenTodaysNoteCommandHandler;
    const dateManager = mockDateManager;
    const calendarViewModel = mockCalendarViewModel;
    const viewModel = mockPeriodNoteViewModel;

    beforeEach(() => {
        const dateManagerFactory = mockDateManagerFactory(dateManager);
        commandHandler = new OpenTodaysNoteCommandHandler(dateManagerFactory, viewModel, calendarViewModel);
    });

    describe('execute', () => {
        it('should call the openNote method on the view model with the period from the date manager and select the note', async () => {
            // Arrange
            const expectedPeriod = <Period> {
                name: '03',
                date: new Date(2023, 9, 3),
                type: PeriodType.Day
            };

            when(dateManager.getCurrentDay).mockReturnValue(expectedPeriod);

            // Act
            await commandHandler.execute();

            // Assert
            expect(dateManager.getCurrentDay).toHaveBeenCalled();
            expect(viewModel.openNote).toHaveBeenCalledWith(ModifierKey.None, expectedPeriod);
            expect(calendarViewModel.setSelectedPeriod).toHaveBeenCalledWith(expectedPeriod);
        });
    });
});