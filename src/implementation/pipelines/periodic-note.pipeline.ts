import {Pipeline} from 'src/domain/pipeline/pipeline';
import {Event} from 'src/domain/events/event';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {PeriodVariableParserStep} from 'src/implementation/pipelines/steps/period-variable-parser.step';

export class PeriodicNotePipeline<T, S extends PeriodicNoteSettings> extends Pipeline<T> {
    constructor(
        event: Event<T>,
        fileService: FileService,
        variableParserStep: PeriodVariableParserStep<T>,
        private readonly settingsRepository: SettingsRepository<S>,
        private readonly nameBuilder: NameBuilder<T>
    ) {
        super(event, fileService);

        this.registerPostCreateStep(variableParserStep);
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