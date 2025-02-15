import {DefaultDateParserFactory} from 'src/infrastructure/factories/default.date-parser-factory';
import {DateFnsDateParser} from 'src/infrastructure/parsers/date-fns.date-parser';

describe('DefaultDateParserFactory', () => {
    let factory: DefaultDateParserFactory;

    beforeEach(() => {
        factory = new DefaultDateParserFactory();
    });

    describe('getParser', () => {
        it('should return a date parser', () => {
            // Act
            const result = factory.getParser();

            // Assert
            expect(result).toBeInstanceOf(DateFnsDateParser);
        });
    });
});