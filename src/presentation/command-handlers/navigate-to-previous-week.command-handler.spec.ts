import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {
    NavigateToNextWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-next-week.command-handler';
import {
    NavigateToPreviousWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-previous-week.command-handler';

describe('NavigateToPreviousWeekCommandHandler', () => {
    let commandHandler: NavigateToPreviousWeekCommandHandler;
    const viewModel = mockCalendarViewModel;

    beforeEach(() => {
        commandHandler = new NavigateToPreviousWeekCommandHandler(viewModel);
    });

    describe('execute', () => {
        it('should call the loadCurrentWeek method on the view model', () => {
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToPreviousWeek).toHaveBeenCalled();
        });
    });
});