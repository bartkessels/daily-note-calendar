import { DefaultVariableBuilder } from './default.variable-builder';
import { VariableType, Variable } from 'src/domain/models/variable';
import { Logger } from 'src/domain/loggers/logger';

describe('DefaultVariableBuilder', () => {
    let logger: jest.Mocked<Logger>;
    let builder: DefaultVariableBuilder;

    beforeEach(() => {
        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message);
            })
        };

        builder = new DefaultVariableBuilder(logger);
    });

    it('should build a variable with name, type, and template', () => {
        const variable: Variable = builder
            .withName('date')
            .withTemplate('YYYY-MM-DD')
            .build();

        expect(variable).toEqual({
            name: 'date',
            type: VariableType.Date,
            template: 'YYYY-MM-DD'
        });
    });

    it('should build a variable with name and type only', () => {
        const variable: Variable = builder
            .withName('title')
            .build();

        expect(variable).toEqual({
            name: 'title',
            type: VariableType.Title,
            template: undefined
        });
    });

    it('should throw an error if name is not provided', () => {
        expect(() => builder.withTemplate('YYYY-MM-DD').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a variable because it has no name');
    });

    it('should throw an error if type is not recognized', () => {
        expect(() => builder.withName('unknown').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a variable because the type is unknown');
    });

    it('should throw an error if template is required but not provided', () => {
        expect(() => builder.withName('date').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a variable because the template is unknown');
    });

    it('should build a variable from a string', () => {
        const variable: Variable = builder
            .fromString('{{date:YYYY-MM-DD}}')
            .build();

        expect(variable).toEqual({
            name: 'date',
            type: VariableType.Date,
            template: 'YYYY-MM-DD'
        });
    });

    it('should throw an error if string does not contain a name', () => {
        expect(() => builder.fromString('{{:YYYY-MM-DD}}').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a variable because it has no name');
    });

    it('should throw an error if string does not contain a template for types that require it', () => {
        expect(() => builder.fromString('{{date}}').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a variable because the template is unknown');
    });
});