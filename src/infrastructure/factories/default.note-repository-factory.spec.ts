import {DefaultNoteRepositoryFactory} from 'src/infrastructure/factories/default.note-repository-factory';
import {mockNoteAdapter} from 'src/test-helpers/adapter.mocks';
import { AdapterNoteRepository } from 'src/infrastructure/repositories/adapter.note-repository';

describe('DefaultNoteRepositoryFactory', () => {
    let factory: DefaultNoteRepositoryFactory;

    beforeEach(() => {
        factory = new DefaultNoteRepositoryFactory(mockNoteAdapter);
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