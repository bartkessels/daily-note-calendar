import {DefaultNoteManagerFactory} from 'src/business/factories/default.note-manager-factory';
import {RepositoryNoteManager} from 'src/business/managers/repository.note-manager';
import {
    mockFileRepositoryFactory,
    mockNoteRepositoryFactory,
} from 'src/test-helpers/factory.mocks';

describe('DefaultNoteManagerFactory', () => {
    let factory: DefaultNoteManagerFactory;

    beforeEach(() => {
        const fileRepositoryFactory = mockFileRepositoryFactory();
        const noteRepositoryFactory = mockNoteRepositoryFactory();

        factory = new DefaultNoteManagerFactory(
            fileRepositoryFactory,
            noteRepositoryFactory
        );
    });

    describe('getManager', () => {
        it('should return a new RepositoryNoteManager', () => {
            // Act
            const result = factory.getManager();

            // Assert
            expect(result).toBeInstanceOf(RepositoryNoteManager);
        });
    });
});