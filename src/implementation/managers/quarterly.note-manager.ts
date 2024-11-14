import {NoteManager} from 'src/domain/managers/note.manager';
import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {QuarterlyNoteSettings} from 'src/domain/models/settings';

export class QuarterlyNoteManager implements NoteManager<Month> {
    constructor(
        event: Event<Month>,
        private readonly settingsRepository: SettingsRepository<QuarterlyNoteSettings>,
        private readonly fileNameBuilder: NameBuilder<Month>,
        private readonly fileService: FileService
    ) {
        event.onEvent((month) => this.tryOpenNote(month));
    }

    public async tryOpenNote(month: Month): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate(settings.nameTemplate)
            .withValue(month)
            .withPath(settings.folder)
            .build();

        return this.fileService.tryOpenFile(filePath, settings.templateFile);
    }
}