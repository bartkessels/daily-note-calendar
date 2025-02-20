import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {ReactElement} from 'react';
import {CalendarViewModelContext} from 'src/presentation/context/calendar-view-model.context';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
import {CalendarComponent} from 'src/presentation/components/calendar.component';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';

describe('CalendarComponent', () => {
    const viewModel = mockCalendarViewModel;
    const uiModel = {
        lastUpdated: new Date(),
        startWeekOnMonday: true,
        selectedPeriod: undefined,
        today: undefined,
        month: undefined,
        year: undefined,
        quarter: undefined,
        weeks: []
    } as CalendarUiModel;

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Header', () => {
        it('should display the current month and year when the uiModel contains a value', () => {

        });

        it('should not display the current month or year when the uiModel is null', () => {
            // Arrange
            setupContent(viewModel);

            // Assert
        });

        it('should call the loadPreviousMonth method when the previous month button is clicked', () => {
            // Arrange

        });

        it('should call the loadPreviousWeek method when the previous week button is clicked', () => {

        });

        it('should call the loadCurrentWeek method when the current week button is clicked', () => {

        });

        it('should call the loadNextWeek method when the next week button is clicked', () => {

        });

        it('should call the loadNextMonth method when the next month button is clicked', () => {

        });
    });
});

function setupContent(viewModel: CalendarViewModel): ReactElement {
    return (
        <CalendarViewModelContext value={viewModel}>
            <CalendarComponent/>
        </CalendarViewModelContext>
    );
}