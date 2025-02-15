import {RepositoryNoteManager} from 'src/business/managers/repository.note-manager';
import {
    mockDateRepository,
    mockFileRepository, mockNoteRepository,
    mockPeriodicNoteSettingsRepository
} from 'src/test-helpers/repository.mocks';

describe('RepositoryNoteManager', () => {
   let manager: RepositoryNoteManager;
   const fileRepository = mockFileRepository;
   const noteRepository = mockNoteRepository;
   const settingsRepository = mockPeriodicNoteSettingsRepository;
   const dateRepository = mockDateRepository;
});