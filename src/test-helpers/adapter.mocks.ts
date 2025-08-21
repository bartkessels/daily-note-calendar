import {FileAdapter} from 'src/infrastructure/adapters/file.adapter';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {SettingsAdapter} from 'src/infrastructure/adapters/settings.adapter';
import {MessageAdapter} from 'src/presentation/adapters/message.adapter';

export const mockFileAdapter = {
    exists: jest.fn(),
    createFile: jest.fn(),
    createFolder: jest.fn(),
    readContents: jest.fn(),
    openInCurrentTab: jest.fn(),
    openInHorizontalSplitView: jest.fn(),
    openInVerticalSplitView: jest.fn(),
    delete: jest.fn()
} as jest.Mocked<FileAdapter>;

export const mockMessageAdapter = {
    show: jest.fn()
} as jest.Mocked<MessageAdapter>;

export const mockNoteAdapter = {
    getActiveNote: jest.fn(),
    getNotes: jest.fn()
} as jest.Mocked<NoteAdapter>;

export const mockSettingsAdapter = {
    getSettings: jest.fn(),
    storeSettings: jest.fn()
} as jest.Mocked<SettingsAdapter>;