// import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
// import {ReactElement} from 'react';
// import {CalendarViewModelContext} from 'src/presentation/context/calendar-view-model.context';
// import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
// import {CalendarComponent} from 'src/presentation/components/calendar.component';
// import {calendarUiModel, CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
// import {Period, PeriodType} from 'src/domain/models/period.model';
// import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
// import {fireEvent, render, screen} from '@testing-library/react';
// import '@testing-library/jest-dom';
// import {periodUiModel} from 'src/presentation/models/period.ui-model';
//
// describe('CalendarComponent', () => {
//     const viewModel = mockCalendarViewModel;
//     let uiModel: CalendarUiModel;
//
//     beforeEach(() => {
//         uiModel = {
//             ...calendarUiModel(DayOfWeek.Monday, weeksOfOctober()),
//             month: periodUiModel(october()),
//             year: periodUiModel(year())
//         };
//     });
//
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//
//     describe('Header', () => {
//         it('should display the current month and year when the uiModel contains a value', () => {
//             // Arrange
//             render(setupContent(viewModel, uiModel));
//
//             // Assert
//             expect(screen.getByText('October')).toBeInTheDocument();
//             expect(screen.getByText('2023')).toBeInTheDocument();
//         });
//
//         it('should not display the current month or year when the uiModel is null', () => {
//             // Arrange
//             render(setupContent(viewModel, null));
//
//             // Assert
//             expect(screen.queryByText('October')).toBeNull();
//             expect(screen.queryByText('2023')).toBeNull();
//         });
//
//         it('should call the loadPreviousMonth method when the previous month button is clicked', () => {
//             // Arrange
//             render(setupContent(viewModel, uiModel));
//
//             // Act
//             fireEvent.click(document.querySelector('.lucide-chevrons-left')!);
//
//             // Arrange
//             expect(viewModel.loadPreviousMonth).toHaveBeenCalled();
//         });
//
//         it('should call the loadPreviousWeek method when the previous week button is clicked', () => {
//             // Arrange
//             render(setupContent(viewModel, uiModel));
//
//             // Act
//             fireEvent.click(document.querySelector('.lucide-chevron-left')!);
//
//             // Arrange
//             expect(viewModel.loadPreviousWeek).toHaveBeenCalled();
//         });
//
//         it('should call the loadCurrentWeek method when the current week button is clicked', () => {
//             // Arrange
//             render(setupContent(viewModel, uiModel));
//
//             // Act
//             fireEvent.click(document.querySelector('.lucide-calendar-heart')!);
//
//             // Arrange
//             expect(viewModel.loadCurrentWeek).toHaveBeenCalled();
//         });
//
//         it('should call the loadNextWeek method when the next week button is clicked', () => {
//             // Arrange
//             render(setupContent(viewModel, uiModel));
//
//             // Act
//             fireEvent.click(document.querySelector('.lucide-chevron-right')!);
//
//             // Arrange
//             expect(viewModel.loadNextWeek).toHaveBeenCalled();
//         });
//
//         it('should call the loadNextMonth method when the next month button is clicked', () => {
//             // Arrange
//             render(setupContent(viewModel, uiModel));
//
//             // Act
//             fireEvent.click(document.querySelector('.lucide-chevrons-right')!);
//
//             // Arrange
//             expect(viewModel.loadNextMonth).toHaveBeenCalled();
//         });
//     });
// });
//
// function setupContent(
//     viewModel: CalendarViewModel,
//     uiModel: CalendarUiModel | null
// ): ReactElement {
//     return (
//         <CalendarViewModelContext value={viewModel}>
//             <CalendarComponent initialUiModel={uiModel}/>
//         </CalendarViewModelContext>
//     );
// }
//
// function september(): Period {
//     return {
//         date: new Date(2023, 8),
//         name: 'September',
//         type: PeriodType.Month
//     };
// }
//
// function october(): Period {
//     return {
//         date: new Date(2023, 9),
//         name: 'October',
//         type: PeriodType.Month
//     };
// }
//
// function year(): Period {
//     return {
//         date: new Date(2023),
//         name: '2023',
//         type: PeriodType.Year
//     };
// }
//
// function weeksOfOctober(): WeekModel[] {
//     return [
//         {
//             date: new Date(2023, 8, 25),
//             name: '39',
//             type: PeriodType.Week,
//             weekNumber: 39,
//             year: year(),
//             month: september(),
//             days: [
//                 {
//                     date: new Date(2023, 8, 25),
//                     name: '25',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 8, 26),
//                     name: '26',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 8, 27),
//                     name: '27',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 8, 28),
//                     name: '28',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 8, 29),
//                     name: '29',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 8, 30),
//                     name: '30',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 1),
//                     name: '01',
//                     type: PeriodType.Day
//                 }
//             ] as Period[]
//         },
//         {
//             date: new Date(2023,9, 2),
//             name: '40',
//             type: PeriodType.Week,
//             weekNumber: 40,
//             year: year(),
//             month: october(),
//             days: [
//                 {
//                     date: new Date(2023, 9, 2),
//                     name: '02',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 3),
//                     name: '03',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 4),
//                     name: '04',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 5),
//                     name: '05',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 6),
//                     name: '06',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 7),
//                     name: '07',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 8),
//                     name: '08',
//                     type: PeriodType.Day
//                 }
//             ] as Period[]
//         },
//         {
//             date: new Date(2023,9, 9),
//             name: '41',
//             type: PeriodType.Week,
//             weekNumber: 41,
//             year: year(),
//             month: october(),
//             days: [
//                 {
//                     date: new Date(2023, 9, 9),
//                     name: '09',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 10),
//                     name: '10',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 11),
//                     name: '11',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 12),
//                     name: '12',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 13),
//                     name: '13',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 14),
//                     name: '14',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 15),
//                     name: '15',
//                     type: PeriodType.Day
//                 }
//             ] as Period[]
//         },
//         {
//             date: new Date(2023,9, 16),
//             name: '42',
//             type: PeriodType.Week,
//             weekNumber: 42,
//             year: year(),
//             month: october(),
//             days: [
//                 {
//                     date: new Date(2023, 9, 16),
//                     name: '16',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 17),
//                     name: '17',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 18),
//                     name: '18',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 19),
//                     name: '19',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 20),
//                     name: '20',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 21),
//                     name: '21',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 22),
//                     name: '22',
//                     type: PeriodType.Day
//                 }
//             ] as Period[]
//         },
//         {
//             date: new Date(2023,9, 23),
//             name: '43',
//             type: PeriodType.Week,
//             weekNumber: 43,
//             year: year(),
//             month: october(),
//             days: [
//                 {
//                     date: new Date(2023, 9, 23),
//                     name: '23',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 24),
//                     name: '24',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 25),
//                     name: '25',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 26),
//                     name: '26',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 27),
//                     name: '27',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 28),
//                     name: '28',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 29),
//                     name: '29',
//                     type: PeriodType.Day
//                 }
//             ] as Period[]
//         },
//         {
//             date: new Date(2023,9, 30),
//             name: '44',
//             type: PeriodType.Week,
//             weekNumber: 44,
//             year: year(),
//             month: october(),
//             days: [
//                 {
//                     date: new Date(2023, 9, 30),
//                     name: '30',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 9, 31),
//                     name: '31',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 10, 1),
//                     name: '01',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 10, 2),
//                     name: '02',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 10, 3),
//                     name: '03',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 10, 4),
//                     name: '04',
//                     type: PeriodType.Day
//                 },
//                 {
//                     date: new Date(2023, 10, 5),
//                     name: '05',
//                     type: PeriodType.Day
//                 }
//             ] as Period[]
//         }
//     ] as WeekModel[];
// }