import {
    NavigateToNextMonthCommandHandler,
} from 'src/presentation/command-handlers/navigate-to-next-month.command-handler';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';

describe('NavigateToNextMonthCommandHandler', () => {
    let commandHandler: NavigateToNextMonthCommandHandler;
    let viewModel: typeof mockCalendarViewModel;

    beforeEach(() => {
        viewModel = mockCalendarViewModel;
        commandHandler = new NavigateToNextMonthCommandHandler(viewModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should call the loadNextMonth method on the view model', () => {
            // Arrange
            
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToNextMonth).toHaveBeenCalled();
        });
    });
});