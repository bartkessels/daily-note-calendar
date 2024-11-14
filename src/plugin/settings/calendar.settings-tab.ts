import {Plugin, PluginSettingTab} from 'obsidian';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {
    DailyNoteSettings,
    MonthlyNoteSettings,
    WeeklyNoteSettings,
    YearlyNoteSettings
} from 'src/domain/models/settings';
import {DailyNoteSettingItems} from 'src/plugin/settings/daily-note.setting-items';
import {WeeklyNoteSettingItems} from 'src/plugin/settings/weekly-note.setting-items';
import {MonthlyNoteSettingItems} from 'src/plugin/settings/monthly-note.setting-items';
import {YearlyNoteSettingItems} from 'src/plugin/settings/yearly-note.setting-items';

export class CalendarSettingsTab extends PluginSettingTab {
    private readonly dailyNoteSettingItems: DailyNoteSettingItems;
    private readonly weeklyNoteSettingItems: WeeklyNoteSettingItems;
    private readonly monthlyNoteSettingItems: MonthlyNoteSettingItems;
    private readonly yearlyNoteSettingItems: YearlyNoteSettingItems;

    constructor(
        plugin: Plugin,
        dailyNotesSettingsRepository: SettingsRepository<DailyNoteSettings>,
        weeklyNotesSettingsRepository: SettingsRepository<WeeklyNoteSettings>,
        monthlyNotesSettingsRepository: SettingsRepository<MonthlyNoteSettings>,
        yearlyNotesSettingsRepository: SettingsRepository<YearlyNoteSettings>
    ) {
        super(plugin.app, plugin);

        this.dailyNoteSettingItems = new DailyNoteSettingItems(this, dailyNotesSettingsRepository);
        this.weeklyNoteSettingItems = new WeeklyNoteSettingItems(this, weeklyNotesSettingsRepository);
        this.monthlyNoteSettingItems = new MonthlyNoteSettingItems(this, monthlyNotesSettingsRepository);
        this.yearlyNoteSettingItems = new YearlyNoteSettingItems(this, yearlyNotesSettingsRepository);
    }

    override async display(): Promise<void> {
        this.containerEl.empty();

        await this.dailyNoteSettingItems.registerSettings();
        await this.weeklyNoteSettingItems.registerSettings();
        await this.monthlyNoteSettingItems.registerSettings();
        await this.yearlyNoteSettingItems.registerSettings();
    }
}
