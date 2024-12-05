import {TodayVariableParserStep} from 'src/implementation/pipelines/steps/today-variable-parser.step';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {DateParser} from 'src/domain/parsers/date.parser';

describe('TodayVariableParserStep', () => {
    let fileAdapter: FileAdapter;
    let variableBuilder: VariableBuilder;
    let dateParser: DateParser;
    let step: TodayVariableParserStep;

    beforeEach(() => {
        fileAdapter = {
            doesFileExist: jest.fn(),
            createFileFromTemplate: jest.fn(),
            openFile: jest.fn(),
            readFileContents: jest.fn(),
            writeFileContents: jest.fn()
        } as FileAdapter;
        variableBuilder = {
            fromString: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue({ template: 'yyyy-MM-dd' })
        } as VariableBuilder;
        dateParser = {
            parse: jest.fn().mockReturnValue('2024-12-31')
        } as DateParser;

        step = new TodayVariableParserStep(fileAdapter, variableBuilder, dateParser);
    });

    it('should replace {{today:YYYY-MM-DD}} with the current date', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'Today\'s date is {{today:yyyy-MM-dd}}.';
        const expectedContent = 'Today\'s date is 2024-12-31.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, {});

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(variableBuilder.fromString).toHaveBeenCalledWith('{{today:yyyy-MM-dd}}');
        expect(dateParser.parse).toHaveBeenCalledWith(expect.any(Date), 'yyyy-MM-dd');
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, expectedContent);
    });

    it('should not modify the file if no {{today:*}} variables are present', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'No date variables here.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, {});

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, fileContent);
    });
});