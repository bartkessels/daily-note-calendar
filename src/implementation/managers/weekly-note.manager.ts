import {NoteManager} from "src/domain/managers/note.manager";
import {Event} from "src/domain/events/Event";
import {Week} from "src/domain/models/Week";
import {SettingsRepository} from "src/domain/repositories/settings.repository";
import {NameBuilder} from "src/domain/builders/name.builder";
import {FileService} from "src/domain/services/file.service";

export class WeeklyNoteManager implements NoteManager<Week> {
    constructor(
        readonly event: Event<Week>,
        private readonly settingsRepository: SettingsRepository,
        private readonly fileNameBuilder: NameBuilder<Week>,
        private readonly fileService: FileService
    ) {
        event.onEvent((week) => this.tryOpenNote(week));
    }

    public async tryOpenNote(week: Week): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate(settings.weeklyNoteNameTemplate)
            .withValue(week)
            .withPath(settings.weeklyNoteFolder)
            .build();

        return this.fileService.tryOpenFile(filePath, settings.weeklyNoteTemplateFile);
    }
}