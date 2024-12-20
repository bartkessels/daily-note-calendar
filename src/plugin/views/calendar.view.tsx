import {StrictMode} from 'react';
import {IconName, ItemView, WorkspaceLeaf} from 'obsidian';
import {createRoot} from 'react-dom/client';
import {DateManager} from 'src/domain/managers/date.manager';
import {CalendarComponent} from 'src/components/calendar.component';
import {DateManagerContext} from 'src/components/providers/date-manager.context';
import {Day} from 'src/domain/models/day';
import {Event} from 'src/domain/events/event';
import {DailyNoteEventContext} from 'src/components/providers/daily-note-event.context';
import {WeeklyNoteEventContext} from 'src/components/providers/weekly-note-event.context';
import {Week} from 'src/domain/models/week';
import {MonthlyNoteEventContext} from 'src/components/providers/monthly-note-event.context';
import {Month} from 'src/domain/models/month';
import {YearlyNoteEventContext} from 'src/components/providers/yearly-note-event.context';
import {Year} from 'src/domain/models/year';
import {QuarterlyNoteEventContext} from 'src/components/providers/quarterly-note-event.context';
import {NotesComponent} from 'src/components/notes.component';
import {NoteEventContext} from 'src/components/providers/note-event.context';
import {Note} from 'src/domain/models/note';
import {RefreshNotesEventContext} from 'src/components/providers/refresh-notes-event.context';
import {SelectDayEventContext} from 'src/components/providers/select-day-event.context';
import {CalendarEnhancerContext} from 'src/components/providers/calendar-enhancer.context';
import {Enhancer} from 'src/domain/enhancers/enhancer';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    constructor(
        leaf: WorkspaceLeaf,
        private readonly dateManager: DateManager,
        private readonly selectDayEvent: Event<Day>,
        private readonly noteEvent: Event<Note>,
        private readonly refreshNotesEvent: Event<Note[]>,
        private readonly yearlyNoteEvent: Event<Year>,
        private readonly quarterlyNoteEvent: Event<Month>,
        private readonly monthlyNoteEvent: Event<Month>,
        private readonly weeklyNoteEvent: Event<Week>,
        private readonly dailyNoteEvent: Event<Day>,
        private readonly calendarEnhancer: Enhancer<CalendarUiModel>
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
                <YearlyNoteEventContext.Provider value={this.yearlyNoteEvent}>
                    <QuarterlyNoteEventContext.Provider value={this.quarterlyNoteEvent}>
                        <MonthlyNoteEventContext.Provider value={this.monthlyNoteEvent}>
                            <DailyNoteEventContext.Provider value={this.dailyNoteEvent}>
                                <WeeklyNoteEventContext.Provider value={this.weeklyNoteEvent}>
                                    <SelectDayEventContext.Provider value={this.selectDayEvent}>
                                        <DateManagerContext.Provider value={this.dateManager}>
                                            <CalendarEnhancerContext.Provider value={this.calendarEnhancer}>
                                                <CalendarComponent />
                                            </CalendarEnhancerContext.Provider>
                                        </DateManagerContext.Provider>
                                    </SelectDayEventContext.Provider>
                                </WeeklyNoteEventContext.Provider>

                                <NoteEventContext.Provider value={this.noteEvent}>
                                    <RefreshNotesEventContext.Provider value={this.refreshNotesEvent}>
                                        <NotesComponent />
                                    </RefreshNotesEventContext.Provider>
                                </NoteEventContext.Provider>
                            </DailyNoteEventContext.Provider>
                        </MonthlyNoteEventContext.Provider>
                    </QuarterlyNoteEventContext.Provider>
                </YearlyNoteEventContext.Provider>
            </StrictMode>
        );
    }
}
