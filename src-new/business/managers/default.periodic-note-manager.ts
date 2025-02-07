import {PeriodicNoteManager} from 'src-new/business/contracts/periodic-note.manager';
import {Period} from 'src-new/domain/models/period.model';
import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {NameBuilder} from 'src-new/business/contracts/name-builder';
import {VariableParserFactory} from 'src-new/business/contracts/variable-parser-factory';
import {VariableType} from 'src-new/domain/models/variable.model';
import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';
import {FileRepositoryFactory} from 'src-new/infrastructure/contracts/file-repository-factory';
import {FileRepository} from 'src-new/infrastructure/contracts/file-repository';

export class DefaultPeriodicNoteManager implements PeriodicNoteManager {
    private readonly nameBuilder: NameBuilder<Period>;
    private readonly fileRepository: FileRepository;

    constructor(
        private readonly nameBuilderFactory: NameBuilderFactory,
        private readonly variableParserFactory: VariableParserFactory,
        private readonly fileRepositoryFactory: FileRepositoryFactory,
    ) {
        this.nameBuilder = this.nameBuilderFactory.getNameBuilder<Period>(NameBuilderType.PeriodicNote);
        this.fileRepository = this.fileRepositoryFactory.getRepository();
    }

    public async createNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const filePath = this.getFilePath(period, settings);
        const fileExists = await this.fileRepository.exists(filePath);

        if (!fileExists) {
            const createdFilePath = await this.fileRepository.create(filePath, settings.templateFile);
            const contents = await this.fileRepository.readContents(createdFilePath);
            const parsedContent = await this.parseVariables(contents, period);

            await this.fileRepository.writeContents(createdFilePath, parsedContent);
        }
    }

    public async openNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const filePath = this.getFilePath(period, settings);
        const fileExists = await this.fileRepository.exists(filePath);

        if (!fileExists) {
            throw new Error('File does not exist');
        }

        await this.fileRepository.open(filePath);
    }

    public async deleteNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const filePath = this.getFilePath(period, settings);
        const fileExists = await this.fileRepository.exists(filePath);

        if (!fileExists) {
            throw new Error('File does not exist');
        }

        await this.fileRepository.delete(filePath);
    }

    private getFilePath(value: Period, settings: PeriodNoteSettings): string {
        return this.nameBuilder
            .withPath(settings.folderTemplate)
            .withName(settings.nameTemplate)
            .withValue(value)
            .build();
    }

    private async parseVariables(content: string, period: Period): Promise<string> {
        const activeFile = await this.fileRepository.getActiveFile();
        const titleVariableParser = this.variableParserFactory.getVariableParser<string | null>(VariableType.Title);
        const periodVariableParser = this.variableParserFactory.getVariableParser<Period>(VariableType.Date);
        const todayVariableParser = this.variableParserFactory.getVariableParser<Date>(VariableType.Today);

        let parsedContent = content;
        parsedContent = titleVariableParser.parseVariables(parsedContent, activeFile);
        parsedContent = periodVariableParser.parseVariables(parsedContent, period);
        parsedContent = todayVariableParser.parseVariables(parsedContent, new Date());
        return parsedContent;
    }
}