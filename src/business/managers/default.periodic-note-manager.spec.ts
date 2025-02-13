import {DefaultPeriodicNoteManager} from 'src/business/managers/default.periodic-note-manager';
import {NameBuilderFactory} from 'src/business/contracts/name-builder-factory';
import {VariableParserFactory} from 'src/business/contracts/variable-parser-factory';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';

describe('DefaultPeriodicNoteManager', () => {
    let manager: DefaultPeriodicNoteManager;

    const nameBuilderFactory = {
        getNameBuilder: jest.fn()
    } as jest.Mocked<NameBuilderFactory>;
    const variableParserFactory = {
        getVariableParser: jest.fn()
    } as jest.Mocked<VariableParserFactory>;
    const fileRepositoryFactory = {
        getRepository: jest.fn()
    } as jest.Mocked<FileRepositoryFactory>;
    const noteRepositoryFactory = {
        getRepository: jest.fn()
    } as jest.Mocked<NoteRepositoryFactory>;

    beforeEach(() => {
        manager = new DefaultPeriodicNoteManager(
            nameBuilderFactory,
            variableParserFactory,
            fileRepositoryFactory,
            noteRepositoryFactory
        );
    });

    describe('createNote', () => {

    });
});