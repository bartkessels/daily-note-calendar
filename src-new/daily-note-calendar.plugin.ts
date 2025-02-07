import {Plugin} from 'obsidian';
import {Dependencies, hoi} from 'src-new/dependencies';
import {SettingsType} from 'src-new/infrastructure/contracts/settings-repository-factory';
import {PluginSettings} from 'src-new/domain/settings/plugin.settings';
import {CalendarView} from 'src-new/presentation/views/calendar.view';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies: Dependencies = hoi(this);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) => new CalendarView(leaf, this.dependencies.viewModel));

        this.app.workspace.onLayoutReady(this.initializePlugin.bind(this));
    }

    private async initializePlugin(): Promise<void> {
        const settings = await this.dependencies.settingsRepositoryFactory
            .getRepository<PluginSettings>(SettingsType.Plugin)
            .get();

        this.dependencies.viewModel.initialize(settings);

        if (this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE).length <= 0) {
            this.app.workspace.getRightLeaf(false)?.setViewState({type: CalendarView.VIEW_TYPE});
        }
    }
}