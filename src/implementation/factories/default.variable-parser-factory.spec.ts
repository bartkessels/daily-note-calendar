import { DefaultVariableParserFactory } from './default.variable-parser-factory';
import { VariableParser } from 'src/domain/parsers/variable.parser';
import { Variable, VariableType } from 'src/domain/models/variable';
import { Logger } from 'src/domain/loggers/logger';

describe('DefaultVariableParserFactory', () => {
    let logger: jest.Mocked<Logger>;
    let dateParser: jest.Mocked<VariableParser>;
    let timeParser: jest.Mocked<VariableParser>;
    let titleParser: jest.Mocked<VariableParser>;
    let factory: DefaultVariableParserFactory;

    beforeEach(() => {
        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message);
            })
        };

        dateParser = {
            tryParse: jest.fn()
        } as jest.Mocked<VariableParser>;

        timeParser = {
            tryParse: jest.fn()
        } as jest.Mocked<VariableParser>;

        titleParser = {
            tryParse: jest.fn()
        } as jest.Mocked<VariableParser>;

        factory = new DefaultVariableParserFactory(dateParser, timeParser, titleParser, logger);
    });

    it('should return the correct parser for date variables', () => {
        const variable: Variable = { name: 'date', type: VariableType.Date, template: 'YYYY-MM-DD' };
        const parser = factory.getVariableParser(variable);

        expect(parser).toBe(dateParser);
    });

    it('should return the correct parser for time variables', () => {
        const variable: Variable = { name: 'time', type: VariableType.Time, template: 'HH:mm:ss' };
        const parser = factory.getVariableParser(variable);

        expect(parser).toBe(timeParser);
    });

    it('should return the correct parser for title variables', () => {
        const variable: Variable = { name: 'title', type: VariableType.Title, template: null };
        const parser = factory.getVariableParser(variable);

        expect(parser).toBe(titleParser);
    });

    it('should throw an error if no parser is found for the variable type', () => {
        const variable = { name: 'unknown', type: -1, template: null };

        expect(() => factory.getVariableParser(variable)).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not find a parser for the variable');
    });
});