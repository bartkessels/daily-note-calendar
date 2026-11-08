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
import {OpenTodaysNoteCommand} from 'src/presentation/commands/open-todays-note.command';
import { OpenMonthlyNoteCommand } from './presentation/commands/open-monthly-note.command';
import { OpenQuarterlyNoteCommand } from './presentation/commands/open-quarterly-note.command';
import { OpenYearlyNoteCommand } from './presentation/commands/open-yearly-note.command';
import {findCalendarLeafIds} from 'src/presentation/workspace/calendar-leaf-recovery';

export default class DailyNoteCalendarPlugin extends Plugin {
    private readonly dependencies: Dependencies = getDependencies(this);

    override async onload(): Promise<void> {
        const calendarView = (leaf: WorkspaceLeaf): CalendarView => new CalendarView(
            leaf,
            this.dependencies.contextMenuAdapter,
            this.dependencies.calendarViewModel,
            this.dependencies.dailyNoteViewModel,
            this.dependencies.weeklyNoteViewModel,
            this.dependencies.monthlyNoteViewModel,
            this.dependencies.quarterlyNoteViewModel,
            this.dependencies.yearlyNoteViewModel,
            this.dependencies.notesViewModel,
        );

        await this.initializePlugin();

        this.registerView(CalendarView.VIEW_TYPE, (leaf) => calendarView(leaf));
        this.registerSettings();
        this.registerCommands();
        this.registerMidnightCheck();

        this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
    }

    private async initializePlugin(): Promise<void> {
        await this.propagateSettings();
    }

    private async propagateSettings(): Promise<void> {
        const today = this.dependencies.dateManagerFactory.getManager().getCurrentDay();
        const settings = await this.dependencies.settingsRepositoryFactory
            .getRepository<PluginSettings>(SettingsType.Plugin)
            .get();

        this.dependencies.calendarViewModel.initialize(settings, today);
        this.dependencies.dailyNoteViewModel.updateSettings(settings);
        this.dependencies.weeklyNoteViewModel.updateSettings(settings);
        this.dependencies.monthlyNoteViewModel.updateSettings(settings);
        this.dependencies.quarterlyNoteViewModel.updateSettings(settings);
        this.dependencies.yearlyNoteViewModel.updateSettings(settings);
    }

    private handleSettingsChange(): void {
        this.propagateSettings()
            .then(() => this.dependencies.calendarViewModel.navigateToCurrentWeek?.())
            // eslint-disable-next-line no-console -- intentional diagnostic logging for settings change errors
            .catch(console.error);
    }

    private onLayoutReady(): void {
        this.registerPlugin();

        this.app.vault.on('create', () => {
            this.dependencies.notesViewModel.updateNotes?.call(this);
            this.dependencies.calendarViewModel.refreshNoteCounts?.call(this);
        });
        this.app.vault.on('delete', () => {
            this.dependencies.notesViewModel.updateNotes?.call(this);
            this.dependencies.calendarViewModel.refreshNoteCounts?.call(this);
        });
        this.app.vault.on('rename', () => {
            this.dependencies.notesViewModel.updateNotes?.call(this);
            this.dependencies.calendarViewModel.refreshNoteCounts?.call(this);
        });
    }

    private registerPlugin(): void {
        const savedLeafIds = findCalendarLeafIds(
            this.app.workspace.getLayout(),
            CalendarView.VIEW_TYPE,
        );

        if (savedLeafIds.length > 0) {
            // Do not create another calendar leaf while the saved ones are
            // still being restored. A delayed onload can make getLeafById
            // return null until the layout has settled.
            this.restoreCalendarLeaves(savedLeafIds);
            window.setTimeout(() => this.restoreCalendarLeaves(savedLeafIds), 500);
            return;
        }

        const liveLeaves = this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE);
        if (liveLeaves.length > 0) {
            liveLeaves.slice(1).forEach((leaf) => leaf.detach());
            return;
        }

        this.app.workspace.getRightLeaf(false)?.setViewState({type: CalendarView.VIEW_TYPE});
    }

    private restoreCalendarLeaves(savedLeafIds: string[]): void {
        const savedLeaves = savedLeafIds
            .map((id) => this.app.workspace.getLeafById(id))
            .filter((leaf): leaf is WorkspaceLeaf => leaf !== null);

        if (savedLeaves.length > 0) {
            const [leafToKeep, ...duplicates] = savedLeaves;
            duplicates.forEach((leaf) => leaf.detach());
            leafToKeep.setViewState({type: CalendarView.VIEW_TYPE});
            return;
        }

        // Once the view is registered, Obsidian may resolve the saved leaves
        // into live leaves. Keep the first one and remove the rest.
        const liveLeaves = this.app.workspace.getLeavesOfType(CalendarView.VIEW_TYPE);
        liveLeaves.slice(1).forEach((leaf) => leaf.detach());
    }

    private registerSettings(): void {
        const settingsTab = new DailyNoteCalendarPluginSettingTab(
            this,
            this.dependencies.dateParserFactory,
            this.dependencies.settingsRepositoryFactory,
            this.handleSettingsChange.bind(this),
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
        this.addCommand(new OpenTodaysNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenTomorrowsNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenWeeklyNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenMonthlyNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenQuarterlyNoteCommand(this.dependencies.commandHandlerFactory));
        this.addCommand(new OpenYearlyNoteCommand(this.dependencies.commandHandlerFactory));
    }

    private registerMidnightCheck(): void {
        const intervalEveryTenMinutesInMs = 600000;
        let lastDate = new Date().toDateString();

        this.registerInterval(
            window.setInterval(() => {
                const currentDate = new Date().toDateString();

                if (currentDate !== lastDate) {
                    lastDate = currentDate;
                    this.updateTodayAcrossPlugin();
                }
            }, intervalEveryTenMinutesInMs),
        );
    }

    private updateTodayAcrossPlugin(): void {
        const today = this.dependencies.dateManagerFactory.getManager().getCurrentDay();
        this.dependencies.calendarViewModel.updateToday(today);
        this.dependencies.calendarViewModel.refreshCalendar?.();
    }
}