import { StrictMode } from 'react';
import { IconName, ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot } from 'react-dom/client';
import { DateManager } from 'src/domain/managers/date.manager';
import {CalendarComponent} from "src/components/calendar.component";
import { DateManagerContext } from 'src/components/providers/datemanager.provider';
import {Day} from "src/domain/models/Day";
import {Event} from "src/domain/events/Event";
import {DailyNoteEventContext} from "src/components/providers/daily-note-event.context";
import {WeeklyNoteEventContext} from "src/components/providers/weekly-note-event.context";
import {Week} from "src/domain/models/Week";

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    constructor(
        leaf: WorkspaceLeaf,
        private readonly dateManager: DateManager,
        private readonly dailyNoteEvent: Event<Day>,
        private readonly weeklyNoteEvent: Event<Week>
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
                <DailyNoteEventContext.Provider value={this.dailyNoteEvent}>
                    <WeeklyNoteEventContext.Provider value={this.weeklyNoteEvent}>
                        <DateManagerContext.Provider value={this.dateManager}>
                            <CalendarComponent />
                        </DateManagerContext.Provider>
                    </WeeklyNoteEventContext.Provider>
                </DailyNoteEventContext.Provider>
            </StrictMode>
        );
    }
}
