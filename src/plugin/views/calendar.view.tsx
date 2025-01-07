import {StrictMode} from 'react';
import {IconName, ItemView, WorkspaceLeaf} from 'obsidian';
import {createRoot} from 'react-dom/client';
import {DateManager} from 'src/domain/managers/date.manager';
import {CalendarComponent} from 'src/components/calendar.component';
import {DateManagerContext} from 'src/components/context/date-manager.context';
import {Day} from 'src/domain/models/day';
import {Event} from 'src/domain/events/event';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {NotesComponent} from 'src/components/notes.component';
import {ManageNoteEventContext} from 'src/components/context/manage-note-event.context';
import {Note} from 'src/domain/models/note';
import {RefreshNotesEventContext} from 'src/components/context/refresh-notes-event.context';
import {CalendarEnhancerContext} from 'src/components/context/calendar-enhancer.context';
import {Enhancer} from 'src/domain/enhancers/enhancer';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {NoteUiModel} from 'src/components/models/note.ui-model';
import {NotesEnhancerContext} from 'src/components/context/notes-enhancer.context';
import {ContextMenuAdapter} from 'src/domain/adapters/context-menu.adapter';
import {NoteContextMenuContext} from 'src/components/context/note-context-menu.context';
import {ManageEvent} from 'src/domain/events/manage.event';
import {Quarter} from 'src/domain/models/quarter';
import {PeriodicNoteEventContext} from 'src/components/context/periodic-note-event.context';

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    constructor(
        leaf: WorkspaceLeaf,
        private readonly noteContextMenu: ContextMenuAdapter,
        private readonly dateManager: DateManager,
        private readonly manageDayEvent: ManageEvent<Day>,
        private readonly manageWeekEvent: ManageEvent<Week>,
        private readonly manageMonthEvent: ManageEvent<Month>,
        private readonly manageQuarterEvent: ManageEvent<Quarter>,
        private readonly manageYearEvent: ManageEvent<Year>,
        private readonly manageNoteEvent: ManageEvent<Note>,
        private readonly refreshNotesEvent: Event<Note[]>,
        private readonly calendarEnhancer: Enhancer<CalendarUiModel>,
        private readonly notesEnhancer: Enhancer<NoteUiModel[]>
    ) {
        super(leaf);
    }

    override getViewType(): string {
        return CalendarView.VIEW_TYPE;
    }

    override getDisplayText(): string {
        return CalendarView.DISPLAY_TEXT;
    }

    override getIcon(): IconName {
        return CalendarView.ICON_NAME;
    }

    protected override async onOpen(): Promise<void> {
        createRoot(this.containerEl.children[1]).render(
            <StrictMode>
                <NoteContextMenuContext value={this.noteContextMenu}>
                    <PeriodicNoteEventContext value={{
                        manageDayEvent: this.manageDayEvent,
                        manageWeekEvent: this.manageWeekEvent,
                        manageMonthEvent: this.manageMonthEvent,
                        manageQuarterEvent: this.manageQuarterEvent,
                        manageYearEvent: this.manageYearEvent
                    }}>
                        <DateManagerContext.Provider value={this.dateManager}>
                            <CalendarEnhancerContext.Provider value={this.calendarEnhancer}>
                                <CalendarComponent/>
                            </CalendarEnhancerContext.Provider>
                        </DateManagerContext.Provider>
                    </PeriodicNoteEventContext>

                    <ManageNoteEventContext.Provider value={this.manageNoteEvent}>
                        <RefreshNotesEventContext.Provider value={this.refreshNotesEvent}>
                            <NotesEnhancerContext.Provider value={this.notesEnhancer}>
                                <NotesComponent/>
                            </NotesEnhancerContext.Provider>
                        </RefreshNotesEventContext.Provider>
                    </ManageNoteEventContext.Provider>
                </NoteContextMenuContext>
            </StrictMode>
        );
    }
}
