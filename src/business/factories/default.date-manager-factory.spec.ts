import {DefaultDateManagerFactory} from 'src/business/factories/default.date-manager-factory';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';
import {RepositoryDateManager} from 'src/business/managers/repository.date-manager';

describe('DefaultDateManagerFactory', () => {
    const dateRepositoryFactory = {
        getRepository: jest.fn()
    } as unknown as jest.Mocked<DateRepositoryFactory>;

    let factory: DefaultDateManagerFactory;

    beforeEach(() => {
        factory = new DefaultDateManagerFactory(dateRepositoryFactory);
    });

    describe('getManager', () => {
        it('should return a new RepositoryDateManager', () => {
            // Act
            const result = factory.getManager();

            // Assert
            expect(result).toBeInstanceOf(RepositoryDateManager);
        });
    });
});