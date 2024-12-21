import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {DateParser} from 'src/domain/parsers/date.parser';
import {PeriodVariableParserStep} from './period-variable-parser.step';
import {Day, DayOfWeek} from 'src/domain/models/day';

describe('PeriodVariableParserStep', () => {
    let fileAdapter: FileAdapter;
    let variableBuilder: VariableBuilder;
    let dateParser: DateParser;
    let step: PeriodVariableParserStep;
    const day: Day = {
        date: new Date('2024-12-31'),
        dayOfWeek: DayOfWeek.Tuesday,
        name: '31'
    };

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

        step = new PeriodVariableParserStep(fileAdapter, variableBuilder, dateParser);
    });

    it('should replace {{date:YYYY-MM-DD}} with the current date', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'Period\'s date is {{date:yyyy-MM-dd}}.';
        const expectedContent = 'Period\'s date is 2024-12-31.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, day);

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(variableBuilder.fromString).toHaveBeenCalledWith('{{date:yyyy-MM-dd}}');
        expect(dateParser.parse).toHaveBeenCalledWith(day.date, 'yyyy-MM-dd');
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, expectedContent);
    });

    it('should not modify the file if no {{Period:*}} variables are present', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'No date variables here.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, day);

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, fileContent);
    });
});