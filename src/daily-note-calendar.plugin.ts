import {Plugin} from 'obsidian';
import {CalendarView} from 'src/plugin/views/calendar.view';
import {CalendarSettingsTab} from 'src/plugin/settings/calendar.settings-tab';
import {createDependencies} from 'src/dependencies';
import 'src/extensions/extensions';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies = createDependencies(this);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) =>
            new CalendarView(
                leaf,
                this.dependencies.dateManager,
                this.dependencies.notesManager,
                this.dependencies.noteEvent,
                this.dependencies.yearlyNoteEvent,
                this.dependencies.quarterlyNoteEvent,
                this.dependencies.monthlyNoteEvent,
                this.dependencies.weeklyNoteEvent,
                this.dependencies.dailyNoteEvent
            )
        );

        this.addSettingTab(new CalendarSettingsTab(
            this,
            this.dependencies.dateParser,
            this.dependencies.generalSettingsRepository,
            this.dependencies.dailyNoteSettingsRepository,
            this.dependencies.weeklyNoteSettingsRepository,
            this.dependencies.monthlyNoteSettingsRepository,
            this.dependencies.quarterlyNoteSettingsRepository,
            this.dependencies.yearlyNoteSettingsRepository
        ));

        this.app.workspace.onLayoutReady(this.setViewStates.bind(this));
    }

    private setViewStates(): void {
        if (this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE).length > 0) {
            return;
        }

        this.app.workspace.getRightLeaf(false)?.setViewState({
            type: CalendarView.VIEW_TYPE
        });
    }
}