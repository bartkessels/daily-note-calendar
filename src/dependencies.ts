import { Plugin } from "obsidian";
import { RepositoryFileManager } from "./implementation/managers/repository.file.manager";
import {AdapterFileService} from "src/implementation/services/adapter.file.service";
import {ObsidianFileAdapter} from "src/plugin/adapters/obsidian-file.adapter";
import { RepositoryDateManager } from "./implementation/managers/repository.date.manager";
import {DateRepository} from "src/domain/repositories/date.repository";
import {DateNameBuilder} from "src/implementation/builders/date.name.builder";
import {PluginSettingsRepository} from "src/implementation/repositories/plugin.settings.repository";
import {DefaultDateRepository} from "src/implementation/repositories/default.date.repository";
import {NoteManager} from "src/domain/managers/note.manager";
import {AdapterNoteManager} from "src/implementation/managers/adapter.note.manager";

export interface Dependencies {
    readonly settingsRepository: PluginSettingsRepository;
    readonly dateFileNameBuilder: DateNameBuilder;
    readonly dateRepository: DateRepository;
    readonly dateManager: RepositoryDateManager;
    readonly fileAdapter: ObsidianFileAdapter;
    readonly fileService: AdapterFileService;
    readonly fileManager: RepositoryFileManager;
    readonly noteManager: NoteManager;
}

export function createDependencies(plugin: Plugin) {
    const settingsRepository = new PluginSettingsRepository(plugin);
    const dateFileNameBuilder = new DateNameBuilder();
    const dateRepository = new DefaultDateRepository();
    const dateManager = new RepositoryDateManager(dateRepository);
    const fileAdapter = new ObsidianFileAdapter(plugin.app.vault, plugin.app.workspace);
    const fileService = new AdapterFileService(fileAdapter);
    const fileManager = new RepositoryFileManager(settingsRepository, dateFileNameBuilder, fileService);
    const noteManager = new AdapterNoteManager(fileAdapter);

    return {
        settingsRepository,
        dateFileNameBuilder,
        dateRepository,
        dateManager,
        fileAdapter,
        fileService,
        fileManager,
        noteManager
    };
}