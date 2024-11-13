import {NoteManager} from "src/domain/managers/note.manager";
import {Event} from "src/domain/events/Event";
import {Day} from "src/domain/models/Day";
import {SettingsRepository} from "src/domain/repositories/settings.repository";
import {NameBuilder} from "src/domain/builders/name.builder";
import {FileService} from "src/domain/services/file.service";

export class DailyNoteManager implements NoteManager<Day> {
    constructor(
        readonly event: Event<Day>,
        private readonly settingsRepository: SettingsRepository,
        private readonly fileNameBuilder: NameBuilder<Day>,
        private readonly fileService: FileService
    ) {
        event.onEvent((day) => this.tryOpenNote(day));
    }

    public async tryOpenNote(day: Day) : Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate(settings.dailyNoteNameTemplate)
            .withValue(day)
            .withPath(settings.dailyNotesFolder)
            .build();

        return this.fileService.tryOpenFile(filePath, settings.dailyNoteTemplateFile);
    }
}