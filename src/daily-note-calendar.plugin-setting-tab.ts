import {Plugin, PluginSettingTab} from 'obsidian';
import {SettingsView} from 'src/presentation/settings/settings-view';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {SettingsRepositoryFactory} from 'src/infrastructure/contracts/settings-repository-factory';
import {
    DailyNotePeriodicNoteSettingsView
} from 'src/presentation/settings/period-notes/daily-note.periodic-note.settings-view';
import {
    WeeklyNotePeriodicNoteSettingsView
} from 'src/presentation/settings/period-notes/weekly-note.periodic-note.settings-view';
import {
    MonthlyNotePeriodicNoteSettingsView
} from 'src/presentation/settings/period-notes/monthly-note.periodic-note.settings-view';
import {
    QuarterlyNotePeriodicNoteSettingsView
} from 'src/presentation/settings/period-notes/quarterly-note.periodic-note.settings-view';
import {
    YearlyNotePeriodicNoteSettingsView
} from 'src/presentation/settings/period-notes/yearly-note.periodic-note.settings-view';
import {DisplayNotesSettingsView} from 'src/presentation/settings/display-notes/display-notes.settings-view';
import {GeneralSettingsView} from 'src/presentation/settings/general/general.settings-view';

export class DailyNoteCalendarPluginSettingTab extends PluginSettingTab {
    private readonly settings: SettingsView[] = [];

    constructor(
        plugin: Plugin,
        dateParserFactory: DateParserFactory,
        settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        super(plugin.app, plugin);

        this.settings.push(new GeneralSettingsView(this, settingsRepositoryFactory));
        this.settings.push(new DisplayNotesSettingsView(this, dateParserFactory, settingsRepositoryFactory));
        this.settings.push(new DailyNotePeriodicNoteSettingsView(this, dateParserFactory, settingsRepositoryFactory));
        this.settings.push(new WeeklyNotePeriodicNoteSettingsView(this, dateParserFactory, settingsRepositoryFactory));
        this.settings.push(new MonthlyNotePeriodicNoteSettingsView(this, dateParserFactory, settingsRepositoryFactory));
        this.settings.push(new QuarterlyNotePeriodicNoteSettingsView(this, dateParserFactory, settingsRepositoryFactory));
        this.settings.push(new YearlyNotePeriodicNoteSettingsView(this, dateParserFactory, settingsRepositoryFactory));
    }

    override async display(): Promise<void> {
        this.containerEl.empty();

        for (let i = 0; i < this.settings.length; i++) {
            await this.settings[i].displaySettings();

            if (i < this.settings.length - 1) {
                this.displaySeparator();
            }
        }
    }

    private displaySeparator(): void {
        this.containerEl.createEl('hr');
    }
}