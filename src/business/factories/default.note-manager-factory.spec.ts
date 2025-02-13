import {DefaultNoteManagerFactory} from 'src/business/factories/default.note-manager-factory';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {SettingsRepositoryFactory} from 'src/infrastructure/contracts/settings-repository-factory';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';
import {RepositoryNoteManager} from 'src/business/managers/repository.note-manager';

describe('DefaultNoteManagerFactory', () => {
    const fileRepositoryFactory = {
        getRepository: jest.fn()
    } as jest.Mocked<FileRepositoryFactory>;
    const noteRepositoryFactory = {
        getRepository: jest.fn()
    } as jest.Mocked<NoteRepositoryFactory>;
    const settingsRepositoryFactory = {
        getRepository: jest.fn()
    } as jest.Mocked<SettingsRepositoryFactory>;
    const dateRepositoryFactory = {
        getRepository: jest.fn()
    } as jest.Mocked<DateRepositoryFactory>;

    let factory: DefaultNoteManagerFactory;

    beforeEach(() => {
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