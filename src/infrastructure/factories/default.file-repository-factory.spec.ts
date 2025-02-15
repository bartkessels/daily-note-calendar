import {DefaultFileRepositoryFactory} from 'src/infrastructure/factories/default.file-repository-factory';
import {mockFileAdapter} from 'src/test-helpers/adapter.mocks';
import {AdapterFileRepository} from 'src/infrastructure/repositories/adapter.file-repository';

describe('DefaultFileRepositoryFactory', () => {
    let factory: DefaultFileRepositoryFactory;

    beforeEach(() => {
        factory = new DefaultFileRepositoryFactory(mockFileAdapter);
    });

    describe('getRepository', () => {
        it('should return a file repository', () => {
            // Act
            const result = factory.getRepository();

            // Assert
            expect(result).toBeInstanceOf(AdapterFileRepository);
        });
    });
});