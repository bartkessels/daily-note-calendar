import {NoteManager} from 'src/domain/managers/note.manager';
import {Event} from 'src/domain/events/event';
import {Day} from 'src/domain/models/day';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {DailyNoteSettings} from 'src/domain/models/settings';

export class DailyNoteManager implements NoteManager<Day> {
    constructor(
        event: Event<Day>,
        private readonly settingsRepository: SettingsRepository<DailyNoteSettings>,
        private readonly fileNameBuilder: NameBuilder<Day>,
        private readonly fileService: FileService
    ) {
        event.onEvent((day) => this.tryOpenNote(day));
    }

    public async tryOpenNote(day: Day) : Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate(settings.nameTemplate)
            .withValue(day)
            .withPath(settings.folder)
            .build();

        return this.fileService.tryOpenFile(filePath, settings.templateFile);
    }
}