import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {
    NavigateToPreviousMonthCommandHandler
} from 'src/presentation/command-handlers/navigate-to-previous-month.command-handler';

describe('NavigateToPreviousMonthCommandHandler', () => {
    let commandHandler: NavigateToPreviousMonthCommandHandler;
    const viewModel = mockCalendarViewModel;

    beforeEach(() => {
        commandHandler = new NavigateToPreviousMonthCommandHandler(viewModel);
    });

    describe('execute', () => {
        it('should call the loadPrevious method on the view model', () => {
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToPreviousMonth).toHaveBeenCalled();
        });
    });
});