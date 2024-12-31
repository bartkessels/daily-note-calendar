import {Plugin} from 'obsidian';
import {CalendarView} from 'src/plugin/views/calendar.view';
import {CalendarSettingsTab} from 'src/plugin/settings/calendar.settings-tab';
import {createDependencies, Dependencies} from 'src/dependencies';
import 'src/extensions/extensions';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies: Dependencies = createDependencies(this);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) =>
            new CalendarView(
                leaf,
                this.dependencies.noteContextMenuAdapter,
                this.dependencies.dateManager,
                this.dependencies.selectDayEvent,
                this.dependencies.noteEvent,
                this.dependencies.refreshNotesEvent,
                this.dependencies.deleteNoteEvent,
                this.dependencies.yearlyNoteEvent,
                this.dependencies.quarterlyNoteEvent,
                this.dependencies.monthlyNoteEvent,
                this.dependencies.weeklyNoteEvent,
                this.dependencies.dailyNoteEvent,
                this.dependencies.calendarEnhancer,
                this.dependencies.notesEnhancer
            )
        );

        this.addSettingTab(new CalendarSettingsTab(
            this,
            this.dependencies.dateParser,
            this.dependencies.generalSettingsRepository,
            this.dependencies.notesSettingsRepository,
            this.dependencies.dailyNoteSettingsRepository,
            this.dependencies.weeklyNoteSettingsRepository,
            this.dependencies.monthlyNoteSettingsRepository,
            this.dependencies.quarterlyNoteSettingsRepository,
            this.dependencies.yearlyNoteSettingsRepository
        ));

        this.app.vault.on('create', this.dependencies.notesManager.refreshNotes.bind(this.dependencies.notesManager));
        this.app.vault.on('rename', this.dependencies.notesManager.refreshNotes.bind(this.dependencies.notesManager));
        this.app.vault.on('delete', this.dependencies.notesManager.refreshNotes.bind(this.dependencies.notesManager));
        this.app.workspace.onLayoutReady(this.initializePlugin.bind(this));
    }

    private initializePlugin(): void {
        const today = this.dependencies.dateManager.getCurrentDay();
        this.dependencies.selectDayEvent.emitEvent(today);

        if (this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE).length > 0) {
            return;
        }

        this.app.workspace.getRightLeaf(false)?.setViewState({
            type: CalendarView.VIEW_TYPE
        });
    }
}