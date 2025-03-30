import {
    NavigateToCurrentWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-current-week.command-handler';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';

describe('NavigateToCurrentWeekCommandHandler', () => {
    let commandHandler: NavigateToCurrentWeekCommandHandler;
    const viewModel = mockCalendarViewModel;

    beforeEach(() => {
        commandHandler = new NavigateToCurrentWeekCommandHandler(viewModel);
    });

    describe('execute', () => {
        it('should call the loadCurrentWeek method on the view model', () => {
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.loadCurrentWeek).toHaveBeenCalled();
        });
    });
});