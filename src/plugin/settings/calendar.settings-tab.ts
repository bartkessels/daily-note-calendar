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

        const title = this.containerEl.createEl('h2');
        title.setText('Daily note calendar settings');

        const docsUri = new DocumentFragment();
        docsUri.createEl('a', {href: 'https://date-fns.org/docs/format'}).setText('date-fns');

        const example = new DocumentFragment();
        example.createEl('br');
        example.createEl('span').setText('Folder name: ');
        example.createEl('code').setText(`'Journaling/'yyyy`);
        example.createEl('span').setText(' would turn into ');
        example.createEl('code').setText(`Journaling/2023`);

        const extraInformation = new DocumentFragment().createEl('p');
        extraInformation.setText('The name and the folder of the periodic notes can include parsable date strings. To include non-parsable characters, use the \'-character (single-quote) to escape them.');
        extraInformation.append(example);

        const documentationInformation = this.containerEl.createEl('p');
        documentationInformation.setText('The daily note calender uses date-fns to parse dates. You can find the format options here: ');
        documentationInformation.append(docsUri);
        documentationInformation.append(extraInformation);


        await this.dailyNoteSettingItems.displaySettings();
        await this.weeklyNoteSettingItems.displaySettings();
        await this.monthlyNoteSettingItems.displaySettings();
        await this.quarterlyNoteSettingItems.displaySettings();
        await this.yearlyNoteSettingItems.displaySettings(false);
    }
}
