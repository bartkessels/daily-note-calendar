import {Plugin} from 'obsidian';
import {Dependencies, hoi} from 'src/dependencies';
import {SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarView} from 'src/presentation/views/calendar.view';
import {DisplayInCalendarCommand} from 'src/presentation/commands/display-in-calendar.command';
import 'src/extensions/extensions';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies: Dependencies = hoi(this);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) => new CalendarView(leaf, this.dependencies.viewModel));

        this.app.workspace.onLayoutReady(this.initializePlugin.bind(this));
        this.addCommand(new DisplayInCalendarCommand(this.dependencies.noteManager, this.dependencies.viewModel));
    }

    private async initializePlugin(): Promise<void> {
        const today = this.dependencies.dateManagerFactory.getManager().getCurrentDay();
        const settings = await this.dependencies.settingsRepositoryFactory
            .getRepository<PluginSettings>(SettingsType.Plugin)
            .get();

        console.log(settings);
        this.dependencies.viewModel.initialize(settings, today);

        if (this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE).length <= 0) {
            this.app.workspace.getRightLeaf(false)?.setViewState({type: CalendarView.VIEW_TYPE});
        }
    }
}