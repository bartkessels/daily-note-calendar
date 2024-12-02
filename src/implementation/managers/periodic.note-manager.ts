import {NoteManager} from 'src/domain/managers/note.manager';
import {Event} from 'src/domain/events/event';
import {FileService} from 'src/domain/services/file.service';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';
import {VariableParser} from 'src/domain/parsers/variable.parser';
import {VariableType} from 'src/domain/models/variable';

export class PeriodicNoteManager<T, S extends PeriodicNoteSettings> implements NoteManager<T> {
    constructor(
        event: Event<T>,
        private readonly settingsRepository: SettingsRepository<S>,
        private readonly fileNameBuilder: NameBuilder<T>,
        private readonly variableParser: VariableParser<T>,
        private readonly fileService: FileService
    ) {
        event.onEvent('PeriodicNoteManager', (data) => this.tryOpenNote(data));
        this.fileService.registerVariableParser(VariableType.Date, this.variableParser);
    }

    public async tryOpenNote(value: T): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate(settings.nameTemplate)
            .withValue(value)
            .withPath(settings.folder)
            .build();

        this.variableParser.setValue(value);
        return this.fileService.tryOpenFileWithTemplate(filePath, settings.templateFile);
    }
}