import {Plugin} from 'obsidian';
import {CalendarView} from 'src/plugin/views/calendar.view';
import {CalendarSettingsTab} from 'src/plugin/settings/calendar.settings-tab';
import {createDependencies, Dependencies} from 'src/dependencies';
import 'src/extensions/extensions';
import {ManageAction} from 'src/domain/events/manage.event';
import {DisplayInCalendarCommand} from 'src/plugin/commands/display-in-calendar.command';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies: Dependencies = createDependencies(this);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) =>
            new CalendarView(
                leaf,
                this.dependencies.noteContextMenuAdapter,
                this.dependencies.dateManager,
                this.dependencies.manageDayEvent,
                this.dependencies.manageWeekEvent,
                this.dependencies.manageMonthEvent,
                this.dependencies.manageQuarterEvent,
                this.dependencies.manageYearEvent,
                this.dependencies.manageNoteEvent,
                this.dependencies.refreshNotesEvent,
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
        this.registerCommands();
        this.app.workspace.onLayoutReady(this.initializePlugin.bind(this));
    }

    private initializePlugin(): void {
        const today = this.dependencies.dateManager.getCurrentDay();
        this.dependencies.manageDayEvent.emitEvent(ManageAction.Preview, today);

        if (this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE).length > 0) {
            return;
        }

        this.app.workspace.getRightLeaf(false)?.setViewState({
            type: CalendarView.VIEW_TYPE
        });
    }

    private registerCommands(): void {
        this.addCommand(new DisplayInCalendarCommand(this.dependencies.displayInCalendarCommandHandler));
    }
}