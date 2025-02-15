import {DefaultNoteManagerFactory} from 'src/business/factories/default.note-manager-factory';
import {RepositoryNoteManager} from 'src/business/managers/repository.note-manager';
import {
    mockDateRepositoryFactory,
    mockFileRepositoryFactory,
    mockNoteRepositoryFactory,
    mockSettingsRepositoryFactory
} from 'src/test-helpers/factory.mocks';

describe('DefaultNoteManagerFactory', () => {
    let factory: DefaultNoteManagerFactory;

    beforeEach(() => {
        const fileRepositoryFactory = mockFileRepositoryFactory();
        const noteRepositoryFactory = mockNoteRepositoryFactory();
        const settingsRepositoryFactory = mockSettingsRepositoryFactory();
        const dateRepositoryFactory = mockDateRepositoryFactory();

        factory = new DefaultNoteManagerFactory(
            fileRepositoryFactory,
            noteRepositoryFactory,
            settingsRepositoryFactory,
            dateRepositoryFactory
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