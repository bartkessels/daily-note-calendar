import {OpenTomorrowsNoteCommandHandler} from 'src/presentation/command-handlers/open-tomorrows-note.command-handler';
import {mockDateManager} from 'src/test-helpers/manager.mocks';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {mockDateManagerFactory} from 'src/test-helpers/factory.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {ModifierKey} from 'src/presentation/models/modifier-key';

describe('OpenTomorrowsNoteCommandHandler', () => {
    let commandHandler: OpenTomorrowsNoteCommandHandler;
    const dateManager = mockDateManager;
    const viewModel = mockCalendarViewModel;

    beforeEach(() => {
        const dateManagerFactory = mockDateManagerFactory(dateManager);
        commandHandler = new OpenTomorrowsNoteCommandHandler(dateManagerFactory, viewModel);
    });

    describe('execute', () => {
        it('should call the openDailyNote method on the view model with the period from the date manager', async () => {
            // Arrange
            const expectedPeriod = <Period> {
                name: '03',
                date: new Date(2023, 9, 3),
                type: PeriodType.Day
            };

            when(dateManager.getTomorrow).mockReturnValue(expectedPeriod);

            // Act
            await commandHandler.execute();

            // Assert
            expect(dateManager.getTomorrow).toHaveBeenCalled();
            expect(viewModel.openDailyNote).toHaveBeenCalledWith(ModifierKey.None, expectedPeriod);
        });
    });
});