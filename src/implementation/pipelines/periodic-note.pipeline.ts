import {Pipeline} from 'src/domain/pipeline/pipeline';
import {Event} from 'src/domain/events/event';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {Period} from 'src/domain/models/period';

export class PeriodicNotePipeline<T extends Period, S extends PeriodicNoteSettings> extends Pipeline<Period> {
    constructor(
        event: Event<T>,
        fileService: FileService,
        private readonly settingsRepository: SettingsRepository<S>,
        private readonly nameBuilder: NameBuilder<T>
    ) {
        super(event, fileService);
    }

    protected override async getFilePath(value: T): Promise<string> {
        const settings = await this.settingsRepository.getSettings();
        return this.nameBuilder
            .withNameTemplate(settings.nameTemplate)
            .withValue(value)
            .withPath(settings.folder)
            .build();
    }

    protected override async createFile(filePath: string): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        await this.fileService.createFileWithTemplate(filePath, settings.templateFile);
    }
}