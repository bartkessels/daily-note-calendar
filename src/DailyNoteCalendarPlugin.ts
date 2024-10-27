import { Plugin } from "obsidian";
import { CalendarView } from "./plugin/views/CalendarView";
import { CalendarSettingsTab } from "./plugin/settings/CalendarSettingsTab";
import { PluginSettingsRepository } from "./implementation/repositories/plugin.settings.repository";
import { DefaultDateRepository } from "./implementation/repositories/default.date.repository";
import { VaultFileService } from "./implementation/services/workspace.file.service";
import 'src/extensions/extensions';
import { RepositoryDateManager } from "./implementation/managers/repository.date.manager";
import { RepositoryFileManager } from "./implementation/managers/repository.file.manager";
import { DateNameBuilder } from "./implementation/builders/date.name.builder";

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly settingsRepository = new PluginSettingsRepository(this);
    private readonly dateFileNameBuilder = new DateNameBuilder();
    private readonly dateRepository = new DefaultDateRepository();
    private readonly dateManager = new RepositoryDateManager(this.dateRepository);
    private readonly fileService = new VaultFileService(this.app.vault, this.app.workspace);
    private readonly fileManager = new RepositoryFileManager(this.settingsRepository, this.dateFileNameBuilder, this.fileService);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) => new CalendarView(
            leaf,
            this.dateManager,
            this.fileManager
        ));
        this.addSettingTab(new CalendarSettingsTab(this, this.settingsRepository));

        this.app.workspace.onLayoutReady(this.setViewStates.bind(this));
    }

    override onunload(): void {
        this.app.workspace.detachLeavesOfType(CalendarView.VIEW_TYPE);
    }

    private setViewStates(): void {
        this.setRightLeafWorkspaceViewState(CalendarView.VIEW_TYPE);
    }

    private setRightLeafWorkspaceViewState(type: string): void {
        if (this.app.workspace.getLeavesOfType(type).length > 0) {
            return;
        }

        this.app.workspace.getRightLeaf(false)?.setViewState({
            type: type
        });
    }
}