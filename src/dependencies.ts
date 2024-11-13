import { Plugin } from "obsidian";
import {AdapterFileService} from "src/implementation/services/adapter.file.service";
import {ObsidianFileAdapter} from "src/plugin/adapters/obsidian-file.adapter";
import { RepositoryDateManager } from "./implementation/managers/repository.date.manager";
import {DateRepository} from "src/domain/repositories/date.repository";
import {PluginSettingsRepository} from "src/implementation/repositories/plugin.settings.repository";
import {DefaultDateRepository} from "src/implementation/repositories/default.date.repository";
import {NoteManager} from "src/domain/managers/note.manager";
import {Day} from "src/domain/models/Day";
import {Event} from "src/domain/events/Event"
import {Week} from "src/domain/models/Week";
import {NameBuilder} from "src/domain/builders/name.builder";
import {Month} from "src/domain/models/Month";
import {DailyNoteEvent} from "src/implementation/events/daily-note.event";
import {DayNameBuilder} from "src/implementation/builders/day.name-builder";
import {DailyNoteManager} from "src/implementation/managers/daily-note.manager";
import {WeeklyNoteEvent} from "src/implementation/events/weekly-note.event";
import {WeekNameBuilder} from "src/implementation/builders/week.name-builder";
import {WeeklyNoteManager} from "src/implementation/managers/weekly-note.manager";
import {MonthlyNoteEvent} from "src/implementation/events/monthly-note.event";
import {MonthNameBuilder} from "src/implementation/builders/month.name-builder";
import {MonthlyNoteManager} from "src/implementation/managers/monthly-note.manager";

export interface Dependencies {
    readonly settingsRepository: PluginSettingsRepository;
    readonly dateRepository: DateRepository;
    readonly dateManager: RepositoryDateManager;
    readonly fileAdapter: ObsidianFileAdapter;
    readonly fileService: AdapterFileService;

    readonly dailyNoteEvent: Event<Day>;
    readonly dayNameBuilder: NameBuilder<Day>;
    readonly dailyNoteManager: NoteManager<Day>;

    readonly weeklyNoteEvent: Event<Week>;
    readonly weekNameBuilder: NameBuilder<Week>;
    readonly weeklyNoteManager: NoteManager<Week>;

    readonly monthlyNoteEvent: Event<Month>;
    readonly monthNameBuilder: NameBuilder<Month>;
    readonly monthlyNoteManager: NoteManager<Month>;
}

export function createDependencies(plugin: Plugin) {
    const settingsRepository = new PluginSettingsRepository(plugin);
    const dateRepository = new DefaultDateRepository();
    const dateManager = new RepositoryDateManager(dateRepository);
    const fileAdapter = new ObsidianFileAdapter(plugin.app.vault, plugin.app.workspace);
    const fileService = new AdapterFileService(fileAdapter);

    const dailyNoteEvent = new DailyNoteEvent();
    const dayNameBuilder = new DayNameBuilder();
    const dailyNoteManager = new DailyNoteManager(dailyNoteEvent, settingsRepository, dayNameBuilder, fileService);

    const weeklyNoteEvent = new WeeklyNoteEvent();
    const weekNameBuilder = new WeekNameBuilder();
    const weeklyNoteManager = new WeeklyNoteManager(weeklyNoteEvent, settingsRepository, weekNameBuilder, fileService);

    const monthlyNoteEvent = new MonthlyNoteEvent();
    const monthNameBuilder = new MonthNameBuilder();
    const monthlyNoteManager = new MonthlyNoteManager(monthlyNoteEvent, settingsRepository, monthNameBuilder, fileService);

    return {
        settingsRepository,
        dateRepository,
        dateManager,
        fileAdapter,
        fileService,

        dailyNoteEvent,
        dayNameBuilder,
        dailyNoteManager,

        weeklyNoteEvent,
        weekNameBuilder,
        weeklyNoteManager,

        monthlyNoteEvent,
        monthNameBuilder,
        monthlyNoteManager
    };
}