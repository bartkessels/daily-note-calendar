import {DefaultDateRepositoryFactory} from 'src/infrastructure/factories/default.date-repository-factory';
import {mockDateParserFactory} from 'src/test-helpers/factory.mocks';
import {DateFnsDateRepository} from 'src/infrastructure/repositories/date-fns.date-repository';

describe('DefaultDateRepositoryFactory', () => {
    let factory: DefaultDateRepositoryFactory;

    beforeEach(() => {
        const dateParserFactory = mockDateParserFactory();

        factory = new DefaultDateRepositoryFactory(dateParserFactory);
    });

    describe('getParser', () => {
        it('should return a date parser', () => {
            // Act
            const result = factory.getRepository();

            // Assert
            expect(result).toBeInstanceOf(DateFnsDateRepository);
        });
    });
});