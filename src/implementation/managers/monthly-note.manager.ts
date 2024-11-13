import {NoteManager} from "src/domain/managers/note.manager";
import {Event} from "src/domain/events/Event";
import {Month} from "src/domain/models/Month";
import {SettingsRepository} from "src/domain/repositories/settings.repository";
import {NameBuilder} from "src/domain/builders/name.builder";
import {FileService} from "src/domain/services/file.service";

export class MonthlyNoteManager implements NoteManager<Month> {
    constructor(
        readonly event: Event<Month>,
        private readonly settingsRepository: SettingsRepository,
        private readonly fileNameBuilder: NameBuilder<Month>,
        private readonly fileService: FileService
    ) {
        event.onEvent((month) => this.tryOpenNote(month));
    }

    public async tryOpenNote(month: Month): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate("")
            .withValue(month)
            .withPath("")
            .build();

        return this.fileService.tryOpenFile(filePath, "");
    }
}