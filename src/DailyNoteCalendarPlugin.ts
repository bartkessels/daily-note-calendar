import { Plugin } from "obsidian";
import { CalendarView } from "./plugin/views/CalendarView";
import { CalendarSettingsTab } from "./plugin/settings/CalendarSettingsTab";
import { PluginSettingsRepository } from "./implementation/PluginSettingsRepository";
import { DefaultDateRepository } from "./implementation/DefaultDateRepository";
import { VaultFileService } from "./implementation/services/WorkspaceFileService";
import { SettingsDailyNoteFileNameBuilder } from "./implementation/builders/SettingsDailyNoteFileNameBuilder";
import { SettingsWeeklyNoteFileNameBuilder } from "./implementation/builders/SettingsWeeklyNoteFileNameBuilder";
import 'src/extensions/string.extensions';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly settingsRepository = new PluginSettingsRepository(this);
    private readonly dailyNoteFileNameBuilder = new SettingsDailyNoteFileNameBuilder(this.settingsRepository);
    private readonly weeklyNoteFileNameBuilder = new SettingsWeeklyNoteFileNameBuilder(this.settingsRepository);
    private readonly dateRepository = new DefaultDateRepository();
    private readonly fileService = new VaultFileService(this.app.vault, this.app.workspace, this.settingsRepository, this.dailyNoteFileNameBuilder, this.weeklyNoteFileNameBuilder);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) => new CalendarView(
            leaf,
            this.fileService,
            this.dateRepository
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