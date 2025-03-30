import {DefaultNoteRepositoryFactory} from 'src/infrastructure/factories/default.note-repository-factory';
import {mockNoteAdapter} from 'src/test-helpers/adapter.mocks';
import {AdapterNoteRepository} from 'src/infrastructure/repositories/adapter.note-repository';
import {mockDateRepositoryFactory, mockSettingsRepositoryFactory} from 'src/test-helpers/factory.mocks';

describe('DefaultNoteRepositoryFactory', () => {
    let factory: DefaultNoteRepositoryFactory;

    beforeEach(() => {
        const noteAdapter = mockNoteAdapter;
        const dateRepositoryFactory = mockDateRepositoryFactory();
        const settingsRepositoryFactory = mockSettingsRepositoryFactory();

        factory = new DefaultNoteRepositoryFactory(noteAdapter, dateRepositoryFactory, settingsRepositoryFactory);
    });

    describe('getRepository', () => {
        it('should return a note repository', () => {
            // Act
            const result = factory.getRepository();

            // Assert
            expect(result).toBeInstanceOf(AdapterNoteRepository);
        });
    });
});