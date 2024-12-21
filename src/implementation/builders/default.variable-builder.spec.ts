import { DefaultVariableBuilder } from 'src/implementation/builders/default.variable-builder';
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
        } as jest.Mocked<Logger>;

        builder = new DefaultVariableBuilder(logger);
    });

    it('should build a variable with name, type, and template', () => {
        const variable: Variable = builder
            .fromString('{{date:yyyy-MM-dd}}')
            .build();

        expect(variable).toEqual({
            name: 'date',
            type: VariableType.Date,
            template: 'yyyy-MM-dd',
            calculus: null
        });
    });

    it('should build a variable with name, type, template, and calculus', () => {
        const variable: Variable = builder
            .fromString('{{date+1d:yyyy-MM-dd}}')
            .build();

        expect(variable).toEqual({
            name: 'date',
            type: VariableType.Date,
            template: 'yyyy-MM-dd',
            calculus: {
                unit: 'd',
                operator: '+',
                value: 1
            }
        });
    });

    it('should build a variable with name and type only', () => {
        const variable: Variable = builder
            .fromString('{{title}}')
            .build();

        expect(variable).toEqual({
            name: 'title',
            type: VariableType.Title,
            template: undefined,
            calculus: null
        });
    });

    it('should throw an error if name is not provided', () => {
        expect(() => builder.fromString('{{:yyyy-MM-dd}}').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a variable because it has no name');
    });

    it('should throw an error if type is not recognized', () => {
        expect(() => builder.fromString('{{unknown}}').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a variable because the type is unknown');
    });

    it('should throw an error if template is required but not provided', () => {
        expect(() => builder.fromString('{{date}}').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a variable because the template is unknown');
    });

    it('should build a variable from a string', () => {
        const variable: Variable = builder
            .fromString('{{date:YYYY-MM-DD}}')
            .build();

        expect(variable).toEqual({
            name: 'date',
            type: VariableType.Date,
            calculus: null,
            template: 'YYYY-MM-DD'
        });
    });

    it('should handle types that do not require a template', () => {
        const variable: Variable = builder
            .fromString('{{title}}')
            .build();

        expect(variable).toEqual({
            name: 'title',
            type: VariableType.Title,
            template: undefined,
            calculus: null
        });
    });
});