import {ItemView, WorkspaceLeaf} from 'obsidian';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
import {createRoot} from 'react-dom/client';
import {StrictMode} from 'react';
import {CalendarViewModelContext} from 'src/presentation/context/calendar-view-model.context';
import {CalendarComponent} from 'src/presentation/components/calendar.component';
import {NotesViewModelContext} from 'src/presentation/context/notes-view-model.context';
import {NotesViewModel} from 'src/presentation/view-models/notes.view-model';

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    constructor(
        leaf: WorkspaceLeaf,
        private readonly calendarViewModel: CalendarViewModel,
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
        createRoot((this.containerEl.children[1])).render(
            <StrictMode>
                <CalendarViewModelContext.Provider value={this.calendarViewModel}>
                    <NotesViewModelContext.Provider value={this.notesViewModel}>
                        <CalendarComponent/>
                    </NotesViewModelContext.Provider>
                </CalendarViewModelContext.Provider>
            </StrictMode>
        );
    }
}