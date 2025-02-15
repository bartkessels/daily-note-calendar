import {ActiveFileVariableParser} from 'src/business/parsers/active-file.variable-parser';

describe('ActiveFileVariableParser', () => {
    let parser: ActiveFileVariableParser;

    beforeEach(() => {
        parser = new ActiveFileVariableParser();
    });

    describe('parseVariables', () => {
        it('should replace the title variable with the value', () => {
            // Arrange
            const expectedTitle = 'Github actions';
            const content = 'In the previous section, we discussed {{title}}';

            // Act
            const result = parser.parseVariables(content, expectedTitle);

            // Assert
            expect(result).toBe('In the previous section, we discussed Github actions');
        });

        it('should replace all title variables with the same value', () => {
            // Arrange
            const expectedTitle = 'Github actions';
            const content = 'In the previous section, we discussed {{title}}, as opposed to the claims made by {{title}}';

            // Act
            const result = parser.parseVariables(content, expectedTitle);

            // Assert
            expect(result).toBe('In the previous section, we discussed Github actions, as opposed to the claims made by Github actions');
        });
    });
});