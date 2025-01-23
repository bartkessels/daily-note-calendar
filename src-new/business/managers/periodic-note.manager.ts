import {Period} from 'src-new/domain/models/date.model';
import {DeleteManager} from 'src-new/business/contracts/delete-manager';
import {OpenManager} from 'src-new/business/contracts/open-manager';
import {CreateManager} from 'src-new/business/contracts/create-manager';
import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';
import {NameBuilder} from 'src-new/business/contracts/name-builder';
import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';
import {VariableParserFactory} from 'src-new/business/contracts/variable-parser-factory';
import {VariableType} from 'src-new/domain/models/variable.model';

export class PeriodicNoteManager<T extends Period> implements CreateManager<T>, OpenManager<T>, DeleteManager<T> {
    private readonly nameBuilder: NameBuilder<T>;

    constructor(
        nameBuilderFactory: NameBuilderFactory,
        private readonly fileAdapter: FileAdapter,
        private readonly settingsRepository: SettingsRepository<PeriodNoteSettings>,
        private readonly variableParserFactory: VariableParserFactory
    ) {
        this.nameBuilder = nameBuilderFactory.getNameBuilder(NameBuilderType.PeriodicNote);
    }

    public async create(value: T): Promise<void> {
        const settings = await this.settingsRepository.get();
        let filePath = await this.getFilePath(value, settings);
        const doesFileExist = await this.fileAdapter.exists(filePath);

        if (!doesFileExist) {
            filePath = await this.createFile(filePath, value, settings.templateFile);
        }

        await this.fileAdapter.open(filePath);
    }

    public async open(value: T): Promise<void> {
        const settings = await this.settingsRepository.get();
        const filePath = await this.getFilePath(value, settings);
        await this.fileAdapter.open(filePath);
    }

    public async delete(value: T): Promise<void> {
        const settings = await this.settingsRepository.get();
        const filePath = await this.getFilePath(value, settings);
        await this.fileAdapter.delete(filePath);
    }

    private async createFile(filePath: string, value: T, templateFilePath?: string | undefined): Promise<string> {
        const createdFilePath = await this.fileAdapter.create(filePath, templateFilePath);
        const contents = await this.fileAdapter.readContents(createdFilePath);
        const parsedContent = await this.parseVariables(contents, value);

        await this.fileAdapter.writeContents(createdFilePath, parsedContent);
        return createdFilePath;
    }

    private async getFilePath(value: T, settings: PeriodNoteSettings): Promise<string> {
        return this.nameBuilder
            .withPath(settings.folderTemplate)
            .withName(settings.nameTemplate)
            .withValue(value)
            .build();
    }

    private async parseVariables(content: string, period: T): Promise<string> {
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