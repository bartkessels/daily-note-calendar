import {
    NavigateToNextMonthCommandHandler
} from 'src/presentation/command-handlers/navigate-to-next-month.command-handler';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';

describe('NavigateToNextMonthCommandHandler', () => {
    let commandHandler: NavigateToNextMonthCommandHandler;
    const viewModel = mockCalendarViewModel;

    beforeEach(() => {
        commandHandler = new NavigateToNextMonthCommandHandler(viewModel);
    });

    describe('execute', () => {
        it('should call the loadNextMonth method on the view model', () => {
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToNextMonth).toHaveBeenCalled();
        });
    });
});