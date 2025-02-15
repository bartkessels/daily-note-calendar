import {NameBuilder} from 'src/business/contracts/name-builder';
import {NameBuilderFactory} from 'src/business/contracts/name-builder-factory';
import {VariableParser} from 'src/business/contracts/variable-parser';
import {VariableParserFactory} from 'src/business/contracts/variable-parser-factory';
import {FileRepository} from 'src/infrastructure/contracts/file-repository';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';
import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {SettingsRepositoryFactory} from 'src/infrastructure/contracts/settings-repository-factory';
import {VariableFactory} from 'src/business/contracts/variable-factory';

export function mockDateParserFactory(parser: DateParser | null = null): jest.Mocked<DateParserFactory> {
    return {
        getParser: jest.fn(() => parser)
    } as jest.Mocked<DateParserFactory>;
}

export function mockDateRepositoryFactory(repository: DateRepository | null = null): jest.Mocked<DateRepositoryFactory> {
    return {
        getRepository: jest.fn(() => repository)
    } as jest.Mocked<DateRepositoryFactory>;
}

export function mockNameBuilderFactory<T>(builder: NameBuilder<T> | null = null): jest.Mocked<NameBuilderFactory> {
    return {
        getNameBuilder: jest.fn((_) => builder)
    } as jest.Mocked<NameBuilderFactory>;
}

export function mockVariableFactory(): jest.Mocked<VariableFactory> {
    return {
        getVariable: jest.fn()
    } as jest.Mocked<VariableFactory>;
}

export function mockVariableParserFactory<T>(parser: VariableParser<T> | null = null): jest.Mocked<VariableParserFactory> {
    return {
        getVariableParser: jest.fn((_) => parser)
    } as jest.Mocked<VariableParserFactory>;
}

export function mockFileRepositoryFactory(repository: FileRepository | null = null): jest.Mocked<FileRepositoryFactory> {
    return {
        getRepository: jest.fn(() => repository)
    } as jest.Mocked<FileRepositoryFactory>;
}

export function mockNoteRepositoryFactory(repository: NoteRepository | null = null): jest.Mocked<NoteRepositoryFactory> {
    return {
        getRepository: jest.fn(() => repository)
    } as jest.Mocked<NoteRepositoryFactory>;
}

export function mockSettingsRepositoryFactory<T>(repository: SettingsRepository<T> | null = null): jest.Mocked<SettingsRepositoryFactory> {
    return {
        getRepository: jest.fn((_) => repository)
    } as jest.Mocked<SettingsRepositoryFactory>;
}