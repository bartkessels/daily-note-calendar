import {DefaultCommandHandlerFactory} from 'src/presentation/factories/default.command-handler-factory';
import {
    mockDateManagerFactory,
    mockNoteManagerFactory,
    mockSettingsRepositoryFactory
} from 'src/test-helpers/factory.mocks';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {DisplayInCalendarCommandHandler} from 'src/presentation/command-handlers/display-in-calendar.command-handler';
import {CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';
import {
    NavigateToCurrentWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-current-week.command-handler';
import {
    NavigateToPreviousWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-previous-week.command-handler';
import {
    NavigateToNextWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-next-week.command-handler';
import {
    NavigateToPreviousMonthCommandHandler
} from 'src/presentation/command-handlers/navigate-to-previous-month.command-handler';
import {
    NavigateToNextMonthCommandHandler
} from 'src/presentation/command-handlers/navigate-to-next-month.command-handler';
import {OpenYesterdaysNoteCommandHandler} from 'src/presentation/command-handlers/open-yesterdays-note.command-handler';
import {OpenTomorrowsNoteCommandHandler} from 'src/presentation/command-handlers/open-tomorrows-note.command-handler';
import {OpenWeeklyNoteCommandHandler} from 'src/presentation/command-handlers/open-weekly-note.command-handler';

describe('DefaultCommandHandlerFactory', () => {
    let factory: DefaultCommandHandlerFactory;

    beforeEach(() => {
        const noteManagerFactory = mockNoteManagerFactory();
        const settingsRepositoryFactory = mockSettingsRepositoryFactory();
        const dateManagerFactory = mockDateManagerFactory();

        factory = new DefaultCommandHandlerFactory(
            noteManagerFactory,
            settingsRepositoryFactory,
            dateManagerFactory,
            mockCalendarViewModel
        );
    });

    describe('getHandler', () => {
        it('should return the display in calendar command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.DisplayInCalendar);

            // Assert
            expect(result).toBeInstanceOf(DisplayInCalendarCommandHandler);
        });

        it('should return the navigate to current week command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.NavigateToCurrentWeek);

            // Assert
            expect(result).toBeInstanceOf(NavigateToCurrentWeekCommandHandler);
        });

        it('should return the navigate to current week command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.NavigateToCurrentWeek);

            // Assert
            expect(result).toBeInstanceOf(NavigateToCurrentWeekCommandHandler);
        });

        it('should return the navigate to current week command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.NavigateToCurrentWeek);

            // Assert
            expect(result).toBeInstanceOf(NavigateToCurrentWeekCommandHandler);
        });

        it('should return the navigate to previous week command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.NavigateToPreviousWeek);

            // Assert
            expect(result).toBeInstanceOf(NavigateToPreviousWeekCommandHandler);
        });

        it('should return the navigate to next week command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.NavigateToNextWeek);

            // Assert
            expect(result).toBeInstanceOf(NavigateToNextWeekCommandHandler);
        });

        it('should return the navigate to previous month command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.NavigateToPreviousMonth);

            // Assert
            expect(result).toBeInstanceOf(NavigateToPreviousMonthCommandHandler);
        });

        it('should return the navigate to next month command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.NavigateToNextMonth);

            // Assert
            expect(result).toBeInstanceOf(NavigateToNextMonthCommandHandler);
        });

        it('should return the open yesterdays note command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.OpenYesterdaysNote);

            // Assert
            expect(result).toBeInstanceOf(OpenYesterdaysNoteCommandHandler);
        });

        it('should return the open tomorrows note command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.OpenTomorrowsNote);

            // Assert
            expect(result).toBeInstanceOf(OpenTomorrowsNoteCommandHandler);
        });

        it('should return the open weekly note command handler', () => {
            // Act
            const result = factory.getHandler(CommandHandlerType.OpenWeeklyNote);

            // Assert
            expect(result).toBeInstanceOf(OpenWeeklyNoteCommandHandler);
        });
    });
});