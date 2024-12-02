import { VariableFileProcessor } from 'src/implementation/processors/variable.file-processor';
import { FileAdapter } from 'src/domain/adapters/file.adapter';
import { Logger } from 'src/domain/loggers/logger';
import { VariableParserFactory } from 'src/domain/factories/variable-parser.factory';
import { VariableBuilder } from 'src/domain/builders/variable.builder';
import { Event } from 'src/domain/events/event';
import { VariableParser } from 'src/domain/parsers/variable.parser';
import {Variable, VariableType} from 'src/domain/models/variable';

describe('VariableFileProcessor', () => {
    let fileAdapter: jest.Mocked<FileAdapter>;
    let logger: jest.Mocked<Logger>;
    let variableBuilder: jest.Mocked<VariableBuilder>;
    let variableParserFactory: jest.Mocked<VariableParserFactory>;
    let noteCreatedEvent: jest.Mocked<Event<string>>;
    let processor: VariableFileProcessor;

    beforeEach(() => {
        fileAdapter = {
            doesFileExist: jest.fn(),
            readFileContents: jest.fn(),
            writeFileContents: jest.fn()
        } as unknown as jest.Mocked<FileAdapter>;

        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message)
            })
        };

        variableBuilder = {
            fromString: jest.fn(),
            withName: jest.fn(),
            withTemplate: jest.fn(),
            build: jest.fn()
        } as jest.Mocked<VariableBuilder>;

        variableParserFactory = {
            getVariableParser: jest.fn()
        } as jest.Mocked<VariableParserFactory>;

        noteCreatedEvent = {
            emitEvent: jest.fn(),
            onEvent: jest.fn()
        } as jest.Mocked<Event<string>>;

        processor = new VariableFileProcessor(noteCreatedEvent, fileAdapter, variableBuilder, variableParserFactory, logger);
    });

    it('should process the file when noteCreatedEvent is triggered', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'Content with {{variable}}';
        const updatedContent = 'Content with parsedValue';
        const variable: Variable = { name: 'variable', type: 'string', template: undefined };
        const variableParser: jest.Mocked<VariableParser> = {
            tryParse: jest.fn().mockReturnValue('parsedValue')
        } as jest.Mocked<VariableParser>;

        fileAdapter.doesFileExist.mockResolvedValue(true);
        fileAdapter.readFileContents.mockResolvedValue(fileContent);
        variableBuilder.fromString.mockReturnValue({ build: jest.fn().mockReturnValue(variable) });
        variableParserFactory.getVariableParser.mockReturnValue(variableParser);

        await processor.process(filePath);

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(variableBuilder.fromString).toHaveBeenCalledWith('{{variable}}');
        expect(variableParserFactory.getVariableParser).toHaveBeenCalledWith(variable);
        expect(variableParser.tryParse).toHaveBeenCalledWith('{{variable}}');
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, updatedContent);
    });

    it('should throw an error if the file does not exist', async () => {
        const filePath = 'non-existent-file.md';

        fileAdapter.doesFileExist.mockResolvedValue(false);

        await expect(processor.process(filePath)).rejects.toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('File does not exist');
    });

    it('should log and throw an error if file reading fails', async () => {
        const filePath = 'test-file.md';

        fileAdapter.doesFileExist.mockResolvedValue(true);
        fileAdapter.readFileContents.mockRejectedValue(new Error('Read error'));

        await expect(processor.process(filePath)).rejects.toThrow('Read error');
    });

    it('should log and throw an error if file writing fails', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'Content with {{variable}}';
        const variable: Variable = { name: 'variable', type: VariableType.Today, template: null };
        const variableParser: jest.Mocked<VariableParser> = {
            create: jest.fn(),
            tryParse: jest.fn().mockReturnValue('parsedValue')
        } as jest.Mocked<VariableParser>;

        fileAdapter.doesFileExist.mockResolvedValue(true);
        fileAdapter.readFileContents.mockResolvedValue(fileContent);
        variableBuilder.fromString.mockReturnValue({ build: jest.fn().mockReturnValue(variable) } as unknown as VariableBuilder);
        variableParserFactory.getVariableParser.mockReturnValue(variableParser);
        fileAdapter.writeFileContents.mockRejectedValue(new Error('Write error'));

        await expect(processor.process(filePath)).rejects.toThrow('Write error');
    });
});