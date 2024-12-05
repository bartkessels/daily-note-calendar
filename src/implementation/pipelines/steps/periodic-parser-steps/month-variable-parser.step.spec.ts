import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {DateParser} from 'src/domain/parsers/date.parser';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {
    MonthVariableParserStep
} from 'src/implementation/pipelines/steps/periodic-parser-steps/month-variable-parser.step';

describe('MonthVariableParserStep', () => {
    let fileAdapter: FileAdapter;
    let variableBuilder: VariableBuilder;
    let dateParser: DateParser;
    let month: Month;
    let step: MonthVariableParserStep;

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
        month = {
            monthIndex: 11,
            quarter: 4,
            year: 2024,
            name: 'December',
            number: 12,
            weeks: [
                <Week> {
                    weekNumber: 49,
                    days: [
                        <Day> {
                            dayOfWeek: DayOfWeek.Monday,
                            date: 2,
                            name: '2',
                            completeDate: new Date('2024-12-2')
                        }
                    ],
                }
            ]
        };

        step = new MonthVariableParserStep(fileAdapter, variableBuilder, dateParser);
    });

    it('should replace {{date:YYYY-MM-DD}} with the complete date', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'The date is {{date:yyyy-MM-dd}}.';
        const expectedContent = 'The date is 2024-12-31.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, month);

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(variableBuilder.fromString).toHaveBeenCalledWith('{{date:yyyy-MM-dd}}');
        expect(dateParser.parse).toHaveBeenCalledWith(month.weeks[0].days[0].completeDate, 'yyyy-MM-dd');
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, expectedContent);
    });

    it('should handle empty weeks array', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'The date is {{date:yyyy-MM-dd}}.';
        const expectedContent = 'The date is {{date:yyyy-MM-dd}}.';
        month.weeks = [];

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, month);

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, expectedContent);
    });

    it('should handle empty days array', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'The date is {{date:yyyy-MM-dd}}.';
        const expectedContent = 'The date is {{date:yyyy-MM-dd}}.';
        month.weeks[0].days = [];

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, month);

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, expectedContent);
    });

    it('should not modify the file if no {{date:*}} variables are present', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'No date variables here.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, month);

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, fileContent);
    });
});