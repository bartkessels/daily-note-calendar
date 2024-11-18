import {NoteManager} from 'src/domain/managers/note.manager';
import {Event} from 'src/domain/events/event';
import {Week} from 'src/domain/models/week';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';

export class WeeklyNoteManager implements NoteManager<Week> {
    constructor(
        event: Event<Week>,
        private readonly settingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>,
        private readonly fileNameBuilder: NameBuilder<Week>,
        private readonly fileService: FileService
    ) {
        event.onEvent((week) => this.tryOpenNote(week));
    }

    public async tryOpenNote(week: Week): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate(settings.nameTemplate)
            .withValue(week)
            .withPath(settings.folder)
            .build();

        return this.fileService.tryOpenFile(filePath, settings.templateFile);
    }
}