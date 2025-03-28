import {Plugin, WorkspaceLeaf} from 'obsidian';
import {Dependencies, getDependencies} from 'src/dependencies';
import {SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarView} from 'src/presentation/views/calendar.view';
import {DisplayInCalendarCommand} from 'src/presentation/commands/display-in-calendar.command';
import {NavigateToCurrentWeekCommand} from 'src/presentation/commands/navigate-to-current-week.command';
import {NavigateToNextWeekCommand} from 'src/presentation/commands/navigate-to-next-week.command';
import {NavigateToPreviousWeekCommand} from 'src/presentation/commands/navigate-to-previous-week.command';
import {OpenYesterdaysNoteCommand} from 'src/presentation/commands/open-yesterdays-note.command';
import {OpenTomorrowsNoteCommand} from 'src/presentation/commands/open-tomorrows-note.command';
import {OpenWeeklyNoteCommand} from 'src/presentation/commands/open-weekly-note.command';
import {NavigateToNextMonthCommand} from 'src/presentation/commands/navigate-to-next-month.command';
import {NavigateToPreviousMonthCommand} from 'src/presentation/commands/navigate-to-previous-month.command';
import {DailyNoteCalendarPluginSettingTab} from 'src/daily-note-calendar.plugin-setting-tab';
import 'src/extensions/extensions';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies: Dependencies = getDependencies(this);

    override async onload(): Promise<void> {
        const calendarView = (leaf: WorkspaceLeaf)=>  new CalendarView(
            leaf,
            this.dependencies.contextMenuAdapter,
            this.dependencies.calendarViewModel,
            this.dependencies.notesViewModel
        );

        this.registerView(CalendarView.VIEW_TYPE, (leaf) => calendarView(leaf));
        this.registerSettings();
        this.registerCommands();

        this.app.workspace.onLayoutReady(this.initializePlugin.bind(this));
    }

    override async onExternalSettingsChange(): Promise<void> {
        await this.initializePlugin();
    }

    private async initializePlugin(): Promise<void> {
        const today = this.dependencies.dateManagerFactory.getManager().getCurrentDay();
        const settings = await this.dependencies.settingsRepositoryFactory
            .getRepository<PluginSettings>(SettingsType.Plugin)
            .get();

        this.dependencies.calendarViewModel.initialize(settings, today);
        this.dependencies.notesViewModel.initialize(settings);

        if (this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE).length <= 0) {
            this.app.workspace.getRightLeaf(false)?.setViewState({type: CalendarView.VIEW_TYPE});
        }
    }

    private registerSettings(): void {
        const settingsTab = new DailyNoteCalendarPluginSettingTab(
            this,
            this.dependencies.dateParserFactory,
            this.dependencies.settingsRepositoryFactory
        );
        this.addSettingTab(settingsTab);
    }

    private registerCommands(): void {
        this.addCommand(new DisplayInCalendarCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new NavigateToCurrentWeekCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new NavigateToNextWeekCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new NavigateToPreviousWeekCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new NavigateToNextMonthCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new NavigateToPreviousMonthCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenYesterdaysNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenTomorrowsNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenWeeklyNoteCommand(this.dependencies.commandHandlerFactory));
    }
}