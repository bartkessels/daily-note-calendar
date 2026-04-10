import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {
    NavigateToPreviousMonthCommandHandler,
} from 'src/presentation/command-handlers/navigate-to-previous-month.command-handler';

describe('NavigateToPreviousMonthCommandHandler', () => {
    let commandHandler: NavigateToPreviousMonthCommandHandler;
    let viewModel: typeof mockCalendarViewModel;

    beforeEach(() => {
        viewModel = mockCalendarViewModel;
        commandHandler = new NavigateToPreviousMonthCommandHandler(viewModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should call the loadPrevious method on the view model', () => {
            // Arrange
            
            //Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToPreviousMonth).toHaveBeenCalled();
        });
    });
});