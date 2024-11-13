import { Plugin } from "obsidian";
import { CalendarView } from "src/plugin/views/calendar.view";
import { CalendarSettingsTab } from "src/plugin/settings/calendar.settings-tab";
import {createDependencies} from "src/dependencies";
import 'src/extensions/extensions';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies = createDependencies(this);

    override async onload(): Promise<void> {
        this.registerView(CalendarView.VIEW_TYPE, (leaf) =>
            new CalendarView(
                leaf,
                this.dependencies.dateManager,
                this.dependencies.dailyNoteEvent,
                this.dependencies.weeklyNoteEvent
            )
        );

        this.addSettingTab(new CalendarSettingsTab(
            this,
            this.dependencies.dailyNoteSettingsRepository,
            this.dependencies.weeklyNoteSettingsRepository,
            this.dependencies.monthlyNoteSettingsRepository
        ));

        this.app.workspace.onLayoutReady(this.setViewStates.bind(this));
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