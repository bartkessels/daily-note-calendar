import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {
    NavigateToNextWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-next-week.command-handler';

describe('NavigateToNextWeekCommandHandler', () => {
    let commandHandler: NavigateToNextWeekCommandHandler;
    const viewModel = mockCalendarViewModel;

    beforeEach(() => {
        commandHandler = new NavigateToNextWeekCommandHandler(viewModel);
    });

    describe('execute', () => {
        it('should call the navigateToNextWeek method on the view model', () => {
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToNextWeek).toHaveBeenCalled();
        });
    });
});