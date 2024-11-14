import {Year} from 'src/domain/models/year';
import {Event} from 'src/domain/events/event';
import {NoteManager} from 'src/domain/managers/note.manager';
import {YearlyNoteSettings} from 'src/domain/models/settings';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';

export class YearlyNoteManager implements NoteManager<Year> {
    constructor(
        event: Event<Year>,
        private readonly settingsRepository: SettingsRepository<YearlyNoteSettings>,
        private readonly fileNameBuilder: NameBuilder<Year>,
        private readonly fileService: FileService
    ) {
        event.onEvent((year) => this.tryOpenNote(year));
    }

    public async tryOpenNote(year: Year): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate(settings.nameTemplate)
            .withValue(year)
            .withPath(settings.folder)
            .build();

        return this.fileService.tryOpenFile(filePath, settings.templateFile);
    }
}