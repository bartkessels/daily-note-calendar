import {ItemView, WorkspaceLeaf} from 'obsidian';
import {createRoot} from 'react-dom/client';
import {StrictMode} from 'react';
import {CalendarComponent} from 'src/presentation/components/calendar.component';
import {NotesViewModel} from 'src/presentation/view-models/default.notes-view-model';
import {ContextMenuAdapterContext} from 'src/presentation/context/context-menu-adapter.context';
import {ContextMenuAdapter} from 'src/presentation/adapters/context-menu.adapter';
import {DayPeriodNoteViewModel} from 'src/presentation/view-models/day.period-note-view-model';
import {WeekPeriodNoteViewModel} from 'src/presentation/view-models/week.period-note-view-model';
import {MonthPeriodNoteViewModel} from 'src/presentation/view-models/month.period-note-view-model';
import {QuarterPeriodNoteViewModel} from 'src/presentation/view-models/quarter.period-note-view-model';
import {YearPeriodNoteViewModel} from 'src/presentation/view-models/year.period-note-view-model';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    constructor(
        leaf: WorkspaceLeaf,
        private readonly contextMenuAdapter: ContextMenuAdapter,
        private readonly calendarViewModel: CalendarViewModel,
        private readonly dailyNoteViewModel: DayPeriodNoteViewModel,
        private readonly weeklyNoteViewModel: WeekPeriodNoteViewModel,
        private readonly monthlyNoteViewModel: MonthPeriodNoteViewModel,
        private readonly quarterlyNoteViewModel: QuarterPeriodNoteViewModel,
        private readonly yearlyNoteViewModel: YearPeriodNoteViewModel,
        private readonly notesViewModel: NotesViewModel
    ) {
        super(leaf);
    }

    override getViewType(): string {
        return CalendarView.VIEW_TYPE;
    }

    override getDisplayText(): string {
        return CalendarView.DISPLAY_TEXT;
    }

    override getIcon(): string {
        return CalendarView.ICON_NAME;
    }

    protected override async onOpen(): Promise<void> {
        const viewModelsContext = {
            calendarViewModel: this.calendarViewModel,
            dailyNoteViewModel: this.dailyNoteViewModel,
            weeklyNoteViewModel: this.weeklyNoteViewModel,
            monthlyNoteViewModel: this.monthlyNoteViewModel,
            quarterlyNoteViewModel: this.quarterlyNoteViewModel,
            yearlyNoteViewModel: this.yearlyNoteViewModel,
            notesViewModel: this.notesViewModel
        } as ViewModelsContext;

        createRoot((this.containerEl.children[1])).render(
            <StrictMode>
                <ContextMenuAdapterContext.Provider value={this.contextMenuAdapter}>
                    <ViewModelsContext value={viewModelsContext}>
                        <CalendarComponent/>
                    </ViewModelsContext>
                </ContextMenuAdapterContext.Provider>
            </StrictMode>
        );
    }
}