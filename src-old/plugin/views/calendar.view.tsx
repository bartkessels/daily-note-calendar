import {StrictMode} from 'react';
import {IconName, ItemView, WorkspaceLeaf} from 'obsidian';
import {createRoot} from 'react-dom/client';
import {DateManager} from 'src-old/domain/managers/date.manager';
import {CalendarComponent} from 'src-old/components/calendar.component';
import {DateManagerContext} from 'src-old/components/context/date-manager.context';
import {Day} from 'src-old/domain/models/day';
import {Event} from 'src-old/domain/events/event';
import {Week} from 'src-old/domain/models/week';
import {Month} from 'src-old/domain/models/month';
import {Year} from 'src-old/domain/models/year';
import {NotesComponent} from 'src-old/components/notes.component';
import {ManageNoteEventContext} from 'src-old/components/context/manage-note-event.context';
import {Note} from 'src-old/domain/models/note';
import {RefreshNotesEventContext} from 'src-old/components/context/refresh-notes-event.context';
import {CalendarEnhancerContext} from 'src-old/components/context/calendar-enhancer.context';
import {Enhancer} from 'src-old/domain/enhancers/enhancer';
import {CalendarUiModel} from 'src-old/components/models/calendar.ui-model';
import {NoteUiModel} from 'src-old/components/models/note.ui-model';
import {NotesEnhancerContext} from 'src-old/components/context/notes-enhancer.context';
import {ContextMenuAdapter} from 'src-old/domain/adapters/context-menu.adapter';
import {NoteContextMenuContext} from 'src-old/components/context/note-context-menu.context';
import {ManageEvent} from 'src-old/domain/events/manage.event';
import {Quarter} from 'src-old/domain/models/quarter';
import {PeriodicNoteEventContext} from 'src-old/components/context/periodic-note-event.context';

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
                <NoteContextMenuContext.Provider value={this.noteContextMenu}>
                    <PeriodicNoteEventContext.Provider value={{
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
                    </PeriodicNoteEventContext.Provider>

                    <ManageNoteEventContext.Provider value={this.manageNoteEvent}>
                        <RefreshNotesEventContext.Provider value={this.refreshNotesEvent}>
                            <NotesEnhancerContext.Provider value={this.notesEnhancer}>
                                <NotesComponent/>
                            </NotesEnhancerContext.Provider>
                        </RefreshNotesEventContext.Provider>
                    </ManageNoteEventContext.Provider>
                </NoteContextMenuContext.Provider>
            </StrictMode>
        );
    }
}
