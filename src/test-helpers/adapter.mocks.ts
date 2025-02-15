import {FileAdapter} from 'src/infrastructure/adapters/file.adapter';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {SettingsAdapter} from 'src/infrastructure/adapters/settings.adapter';

export const mockFileAdapter = {
    exists: jest.fn(),
    createFileFromTemplate: jest.fn(),
    createFile: jest.fn(),
    createFolder: jest.fn(),
    readContents: jest.fn(),
    writeContents: jest.fn(),
    open: jest.fn(),
    delete: jest.fn()
} as jest.Mocked<FileAdapter>;

export const mockNoteAdapter = {
    getActiveNote: jest.fn(),
    getNotes: jest.fn()
} as jest.Mocked<NoteAdapter>;

export const mockSettingsAdapter = {
    getSettings: jest.fn(),
    storeSettings: jest.fn()
} as jest.Mocked<SettingsAdapter>;