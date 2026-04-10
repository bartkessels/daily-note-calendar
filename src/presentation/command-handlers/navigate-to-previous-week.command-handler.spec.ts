import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {
    NavigateToNextWeekCommandHandler,
} from 'src/presentation/command-handlers/navigate-to-next-week.command-handler';
import {
    NavigateToPreviousWeekCommandHandler,
} from 'src/presentation/command-handlers/navigate-to-previous-week.command-handler';

describe('NavigateToPreviousWeekCommandHandler', () => {
    let commandHandler: NavigateToPreviousWeekCommandHandler;
    let viewModel: typeof mockCalendarViewModel;

    beforeEach(() => {
        viewModel = mockCalendarViewModel;
        commandHandler = new NavigateToPreviousWeekCommandHandler(viewModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should call the loadCurrentWeek method on the view model', () => {
            // Arrange
            
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToPreviousWeek).toHaveBeenCalled();
        });
    });
});