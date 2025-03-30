import {DefaultDateManagerFactory} from 'src/business/factories/default.date-manager-factory';
import {RepositoryDateManager} from 'src/business/managers/repository.date-manager';
import {mockDateRepositoryFactory} from 'src/test-helpers/factory.mocks';

describe('DefaultDateManagerFactory', () => {
    let factory: DefaultDateManagerFactory;

    beforeEach(() => {
        const dateRepositoryFactory = mockDateRepositoryFactory();
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