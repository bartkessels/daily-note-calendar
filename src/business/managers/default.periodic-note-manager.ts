import {PeriodicNoteManager} from 'src/business/contracts/periodic-note.manager';
import {Period} from 'src/domain/models/period.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {VariableParserFactory} from 'src/business/contracts/variable-parser-factory';
import {VariableType} from 'src/domain/models/variable.model';
import {NameBuilderFactory, NameBuilderType} from 'src/business/contracts/name-builder-factory';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';

export class DefaultPeriodicNoteManager implements PeriodicNoteManager {
    constructor(
        private readonly nameBuilderFactory: NameBuilderFactory,
        private readonly variableParserFactory: VariableParserFactory,
        private readonly fileRepositoryFactory: FileRepositoryFactory,
        private readonly noteRepositoryFactory: NoteRepositoryFactory
    ) {

    }

    public async createNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const fileRepository = this.fileRepositoryFactory.getRepository();
        const filePath = this.getFilePath(period, settings);
        const fileExists = await fileRepository.exists(filePath);

        if (!fileExists) {
            const createdFilePath = await fileRepository.create(filePath, settings.templateFile);
            const contents = await fileRepository.readContents(createdFilePath);
            const parsedContent = await this.parseVariables(contents, period);

            await fileRepository.writeContents(createdFilePath, parsedContent);
        }
    }

    public async openNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const fileRepository = this.fileRepositoryFactory.getRepository();
        const filePath = this.getFilePath(period, settings);
        const fileExists = await fileRepository.exists(filePath);

        if (!fileExists) {
            throw new Error('File does not exist');
        }

        await fileRepository.open(filePath);
    }

    public async deleteNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const fileRepository = this.fileRepositoryFactory.getRepository();
        const filePath = this.getFilePath(period, settings);
        const fileExists = await fileRepository.exists(filePath);

        if (!fileExists) {
            throw new Error('File does not exist');
        }

        await fileRepository.delete(filePath);
    }

    private getFilePath(value: Period, settings: PeriodNoteSettings): string {
        const nameBuilder = this.nameBuilderFactory.getNameBuilder<Period>(NameBuilderType.PeriodicNote);

        return nameBuilder
            .withPath(settings.folder)
            .withName(settings.nameTemplate)
            .withValue(value)
            .build();
    }

    private async parseVariables(content: string, period: Period): Promise<string> {
        const noteRepository = this.noteRepositoryFactory.getRepository();
        const activeFile = await noteRepository.getActiveNote();
        const titleVariableParser = this.variableParserFactory.getVariableParser<string | undefined>(VariableType.Title);
        const periodVariableParser = this.variableParserFactory.getVariableParser<Period>(VariableType.Date);
        const todayVariableParser = this.variableParserFactory.getVariableParser<Date>(VariableType.Today);

        let parsedContent = content;
        parsedContent = titleVariableParser.parseVariables(parsedContent, activeFile?.name);
        parsedContent = periodVariableParser.parseVariables(parsedContent, period);
        parsedContent = todayVariableParser.parseVariables(parsedContent, new Date());
        return parsedContent;
    }
}