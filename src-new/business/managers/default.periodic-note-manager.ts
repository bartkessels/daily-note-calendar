import {PeriodicNoteManager} from 'src-new/business/contracts/periodic-note.manager';
import {Period} from 'src-new/domain/models/period.model';
import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {NameBuilder} from 'src-new/business/contracts/name-builder';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';
import {VariableParserFactory} from 'src-new/business/contracts/variable-parser-factory';
import {VariableType} from 'src-new/domain/models/variable.model';
import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';

export class DefaultPeriodicNoteManager implements PeriodicNoteManager {
    private readonly nameBuilder: NameBuilder<Period>;

    constructor(
        private readonly nameBuilderFactory: NameBuilderFactory,
        private readonly variableParserFactory: VariableParserFactory,
        private readonly fileAdapter: FileAdapter
    ) {
        this.nameBuilder = this.nameBuilderFactory.getNameBuilder<Period>(NameBuilderType.PeriodicNote);
    }

    public async createNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const filePath = this.getFilePath(period, settings);
        const fileExists = await this.fileAdapter.exists(filePath);

        if (!fileExists) {
            const createdFilePath = await this.fileAdapter.create(filePath, settings.templateFile);
            const contents = await this.fileAdapter.readContents(createdFilePath);
            const parsedContent = await this.parseVariables(contents, period);

            await this.fileAdapter.writeContents(createdFilePath, parsedContent);
        }
    }

    public async openNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const filePath = this.getFilePath(period, settings);
        const fileExists = await this.fileAdapter.exists(filePath);

        if (!fileExists) {
            throw new Error('File does not exist');
        }

        await this.fileAdapter.open(filePath);
    }

    public async deleteNote(settings: PeriodNoteSettings, period: Period): Promise<void> {
        const filePath = this.getFilePath(period, settings);
        const fileExists = await this.fileAdapter.exists(filePath);

        if (!fileExists) {
            throw new Error('File does not exist');
        }

        await this.fileAdapter.delete(filePath);
    }

    private getFilePath(value: Period, settings: PeriodNoteSettings): string {
        return this.nameBuilder
            .withPath(settings.folderTemplate)
            .withName(settings.nameTemplate)
            .withValue(value)
            .build();
    }

    private async parseVariables(content: string, period: Period): Promise<string> {
        const activeFile = await this.fileAdapter.getActiveFile();
        const titleVariableParser = this.variableParserFactory.getVariableParser<string | undefined>(VariableType.Title);
        const periodVariableParser = this.variableParserFactory.getVariableParser<Period>(VariableType.Date);
        const todayVariableParser = this.variableParserFactory.getVariableParser<Date>(VariableType.Today);

        let parsedContent = content;
        parsedContent = titleVariableParser.parseVariables(parsedContent, activeFile);
        parsedContent = periodVariableParser.parseVariables(parsedContent, period);
        parsedContent = todayVariableParser.parseVariables(parsedContent, new Date());
        return parsedContent;
    }
}