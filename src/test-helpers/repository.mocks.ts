import {FileRepository} from 'src/infrastructure/contracts/file-repository';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {GeneralSettings} from 'src/domain/settings/general.settings';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';

export const mockFileRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    readContents: jest.fn(),
    writeContents: jest.fn(),
    open: jest.fn(),
    delete: jest.fn()
} as jest.Mocked<FileRepository>;

export const mockNoteRepository = {
    getActiveNote: jest.fn()
} as jest.Mocked<NoteRepository>;

export const mockDateRepository = {
    getDayFromDate: jest.fn(),
    getDayFromDateString: jest.fn(),
    getWeekFromDate: jest.fn(),
    getWeek: jest.fn(),
    getPreviousWeek: jest.fn(),
    getNextWeek: jest.fn(),
    getQuarter: jest.fn()
} as jest.Mocked<DateRepository>;

export const mockPeriodicNoteSettingsRepository = {
    store: jest.fn(),
    get: jest.fn()
} as jest.Mocked<SettingsRepository<PeriodNoteSettings>>;

export const mockDisplayNoteSettingsRepository = {
    store: jest.fn(),
    get: jest.fn()
} as jest.Mocked<SettingsRepository<DisplayNotesSettings>>;

export const mockGeneralSettingsRepository = {
    store: jest.fn(),
    get: jest.fn()
} as jest.Mocked<SettingsRepository<GeneralSettings>>;

export const mockPluginSettingsRepository = {
    store: jest.fn(),
    get: jest.fn()
} as jest.Mocked<SettingsRepository<PluginSettings>>;