import {Plugin} from 'obsidian';
import {Dependencies, getDependencies} from 'src/dependencies';
import {SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarView} from 'src/presentation/views/calendar.view';
import {DisplayInCalendarCommand} from 'src/presentation/commands/display-in-calendar.command';
import 'src/extensions/extensions';
import {NavigateToCurrentWeekCommand} from 'src/presentation/commands/navigate-to-current-week.command';
import {NavigateToNextWeekCommand} from 'src/presentation/commands/navigate-to-next-week.command';
import {NavigateToPreviousWeekCommand} from 'src/presentation/commands/navigate-to-previous-week.command';
import {OpenYesterdaysNoteCommand} from 'src/presentation/commands/open-yesterdays-note.command';
import {OpenTomorrowsNoteCommand} from 'src/presentation/commands/open-tomorrows-note.command';
import {OpenWeeklyNoteCommand} from 'src/presentation/commands/open-weekly-note.command';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies: Dependencies = getDependencies(this);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) => new CalendarView(leaf, this.dependencies.viewModel));
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

        this.dependencies.viewModel.initialize(settings, today);

        if (this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE).length <= 0) {
            this.app.workspace.getRightLeaf(false)?.setViewState({type: CalendarView.VIEW_TYPE});
        }
    }

    private registerCommands(): void {
        this.addCommand(new DisplayInCalendarCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new NavigateToCurrentWeekCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new NavigateToNextWeekCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new NavigateToPreviousWeekCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenYesterdaysNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenTomorrowsNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenWeeklyNoteCommand(this.dependencies.commandHandlerFactory));
    }
}