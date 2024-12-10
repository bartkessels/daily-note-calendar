import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {DateParser} from 'src/domain/parsers/date.parser';
import {Day, DayOfWeek} from 'src/domain/models/day';
import { DayVariableParserStep } from './day-variable-parser.step';

describe('DayVariableParserStep', () => {
    let fileAdapter: FileAdapter;
    let variableBuilder: VariableBuilder;
    let dateParser: DateParser;
    let day: Day;
    let step: DayVariableParserStep;

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
        day = {
            dayOfWeek: DayOfWeek.Tuesday,
            date: 31,
            name: '31',
            completeDate: new Date('2024-12-31')
        };

        step = new DayVariableParserStep(fileAdapter, variableBuilder, dateParser);
    });

    it('should replace {{date:YYYY-MM-DD}} with the complete date', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'The date is {{date:yyyy-MM-dd}}.';
        const expectedContent = 'The date is 2024-12-31.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, day);

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(variableBuilder.fromString).toHaveBeenCalledWith('{{date:yyyy-MM-dd}}');
        expect(dateParser.parse).toHaveBeenCalledWith(day.completeDate, 'yyyy-MM-dd');
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, expectedContent);
    });

    it('should not modify the file if no {{date:*}} variables are present', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'No date variables here.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, day);

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, fileContent);
    });
});