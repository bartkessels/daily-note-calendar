import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {DateParser} from 'src/domain/parsers/date.parser';
import {PeriodVariableParserStep} from './period-variable-parser.step';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {Calculus, CalculusOperator, VariableType} from 'src/domain/models/variable';
import 'src/extensions/extensions';

describe('PeriodVariableParserStep', () => {
    let fileAdapter: FileAdapter;
    let variableBuilder: jest.Mocked<VariableBuilder>;
    let dateParser: jest.Mocked<DateParser>;
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
            writeFileContents: jest.fn(),
            deleteFile: jest.fn()
        } as FileAdapter;
        variableBuilder = {
            fromString: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue({template: 'yyyy-MM-dd'})
        };
        dateParser = {
            parse: jest.fn().mockReturnValue('2024-12-31')
        };

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

    it('should get the calculated date if calculus is present', async () => {
        const calculus: Calculus = {
            operator: CalculusOperator.Add,
            unit: 'd',
            value: 1
        };
        const filePath = 'test-file.md';
        const fileContent = 'Period\'s date is {{date+1d:yyyy-MM-dd}}.';
        const calculateSpy = jest.spyOn(Date.prototype, 'calculate').mockReturnValue(new Date('2025-01-01'));
        variableBuilder.build.mockReturnValue({
            name: 'date',
            template: 'yyyy-MM-dd',
            calculus: calculus,
            type: VariableType.Date
        });

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);

        await step.executePostCreate(filePath, day);

        expect(calculateSpy).toHaveBeenCalledWith(calculus);
        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(variableBuilder.fromString).toHaveBeenCalledWith('{{date+1d:yyyy-MM-dd}}');
        expect(dateParser.parse).toHaveBeenCalledWith(new Date('2025-01-01'), 'yyyy-MM-dd');
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