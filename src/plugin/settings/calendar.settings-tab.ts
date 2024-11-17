import {Plugin, PluginSettingTab} from 'obsidian';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {
    DailyNoteSettings,
    MonthlyNoteSettings, QuarterlyNoteSettings,
    WeeklyNoteSettings,
    YearlyNoteSettings
} from 'src/domain/models/settings';
import {DailyNoteSettingItems} from 'src/plugin/settings/daily-note.setting-items';
import {WeeklyNoteSettingItems} from 'src/plugin/settings/weekly-note.setting-items';
import {MonthlyNoteSettingItems} from 'src/plugin/settings/monthly-note.setting-items';
import {YearlyNoteSettingItems} from 'src/plugin/settings/yearly-note.setting-items';
import {QuarterlyNoteSettingItems} from 'src/plugin/settings/quarterly-note.setting-items';
import {DateParser} from 'src/domain/parsers/date.parser';

export class CalendarSettingsTab extends PluginSettingTab {
    private readonly dailyNoteSettingItems: DailyNoteSettingItems;
    private readonly weeklyNoteSettingItems: WeeklyNoteSettingItems;
    private readonly monthlyNoteSettingItems: MonthlyNoteSettingItems;
    private readonly quarterlyNoteSettingItems: QuarterlyNoteSettingItems;
    private readonly yearlyNoteSettingItems: YearlyNoteSettingItems;

    constructor(
        plugin: Plugin,
        dateParser: DateParser,
        dailyNotesSettingsRepository: SettingsRepository<DailyNoteSettings>,
        weeklyNotesSettingsRepository: SettingsRepository<WeeklyNoteSettings>,
        monthlyNotesSettingsRepository: SettingsRepository<MonthlyNoteSettings>,
        quarterlyNotesSettingsRepository: SettingsRepository<QuarterlyNoteSettings>,
        yearlyNotesSettingsRepository: SettingsRepository<YearlyNoteSettings>
    ) {
        super(plugin.app, plugin);

        this.dailyNoteSettingItems = new DailyNoteSettingItems(this, dateParser, dailyNotesSettingsRepository);
        this.weeklyNoteSettingItems = new WeeklyNoteSettingItems(this, dateParser, weeklyNotesSettingsRepository);
        this.monthlyNoteSettingItems = new MonthlyNoteSettingItems(this, dateParser, monthlyNotesSettingsRepository);
        this.quarterlyNoteSettingItems = new QuarterlyNoteSettingItems(this, dateParser, quarterlyNotesSettingsRepository);
        this.yearlyNoteSettingItems = new YearlyNoteSettingItems(this, dateParser, yearlyNotesSettingsRepository);
    }

    override async display(): Promise<void> {
        this.containerEl.empty();

        await this.dailyNoteSettingItems.registerSettings();
        await this.weeklyNoteSettingItems.registerSettings();
        await this.monthlyNoteSettingItems.registerSettings();
        await this.quarterlyNoteSettingItems.registerSettings();
        await this.yearlyNoteSettingItems.registerSettings();
    }
}
