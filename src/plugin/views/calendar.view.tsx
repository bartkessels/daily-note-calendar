import {StrictMode} from 'react';
import {IconName, ItemView, WorkspaceLeaf} from 'obsidian';
import {createRoot} from 'react-dom/client';
import {DateManager} from 'src/domain/managers/date.manager';
import {CalendarComponent} from 'src/components/calendar.component';
import {DateManagerContext} from 'src/components/providers/datemanager.provider';
import {Day} from 'src/domain/models/day';
import {Event} from 'src/domain/events/event';
import {DailyNoteEventContext} from 'src/components/providers/daily-note-event.context';
import {WeeklyNoteEventContext} from 'src/components/providers/weekly-note-event.context';
import {Week} from 'src/domain/models/week';
import {MonthlyNoteEventContext} from 'src/components/providers/monthly-note-event.context';
import {Month} from 'src/domain/models/month';
import {YearlyNoteEventContext} from 'src/components/providers/yearly-note-event.provider';
import {Year} from 'src/domain/models/year';

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    constructor(
        leaf: WorkspaceLeaf,
        private readonly dateManager: DateManager,
        private readonly yearlyNoteEvent: Event<Year>,
        private readonly monthlyNoteEvent: Event<Month>,
        private readonly weeklyNoteEvent: Event<Week>,
        private readonly dailyNoteEvent: Event<Day>
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
                    <MonthlyNoteEventContext.Provider value={this.monthlyNoteEvent}>
                        <DailyNoteEventContext.Provider value={this.dailyNoteEvent}>
                            <WeeklyNoteEventContext.Provider value={this.weeklyNoteEvent}>
                                <DateManagerContext.Provider value={this.dateManager}>
                                    <CalendarComponent/>
                                </DateManagerContext.Provider>
                            </WeeklyNoteEventContext.Provider>
                        </DailyNoteEventContext.Provider>
                    </MonthlyNoteEventContext.Provider>
                </YearlyNoteEventContext.Provider>
            </StrictMode>
        );
    }
}