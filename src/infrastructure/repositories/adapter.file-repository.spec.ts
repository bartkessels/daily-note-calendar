import {AdapterFileRepository} from 'src/infrastructure/repositories/adapter.file-repository';
import {mockFileAdapter} from 'src/test-helpers/adapter.mocks';
import {afterEach} from '@jest/globals';
import {when} from 'jest-when';

describe('AdapterFileRepository', () => {
    let repository: AdapterFileRepository;
    const fileAdapter = mockFileAdapter;

    beforeEach(() => {
        repository = new AdapterFileRepository(fileAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('exists', () => {
        it('should return the when the adapter returns true', async () => {
            // Arrange
            const filePath = 'some-path';
            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(true);

            // Act
            const result = await repository.exists(filePath);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false when the adapter returns false', async () => {
            // Arrange
            const filePath = 'some-path';
            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(false);

            // Act
            const result = await repository.exists(filePath);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('create', () => {
        it('should return the complete file path for the file when it is created', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            const templateFilePath = 'templates/daily-notes.md';

            when(fileAdapter.exists).calledWith(templateFilePath).mockResolvedValue(true);
            when(fileAdapter.createFileFromTemplate).calledWith(filePath, templateFilePath).mockResolvedValue(filePath);

            // Act
            const result = await repository.create(filePath, templateFilePath);

            // Assert
            expect(result).toBe(filePath);
        });

        it('should create the folder for the file', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            const templateFilePath = 'templates/daily-notes.md';

            when(fileAdapter.exists).calledWith(templateFilePath).mockResolvedValue(true);

            // Act
            await repository.create(filePath, templateFilePath);

            // Assert
            expect(fileAdapter.createFolder).toHaveBeenCalledWith('daily-notes');
        });

        it('should create a file from a template when the template file exists', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            const templateFilePath = 'templates/daily-notes.md';

            when(fileAdapter.exists).calledWith(templateFilePath).mockResolvedValue(true);

            // Act
            await repository.create(filePath, templateFilePath);

            // Assert
            expect(fileAdapter.createFileFromTemplate).toHaveBeenCalledWith(filePath, templateFilePath);
            expect(fileAdapter.createFile).not.toHaveBeenCalled();
        });

        it('should create a file without a template when the template file does not exist', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            const templateFilePath = 'templates/daily-notes.md';

            when(fileAdapter.exists).calledWith(templateFilePath).mockResolvedValue(false);

            // Act
            await repository.create(filePath, templateFilePath);

            // Assert
            expect(fileAdapter.createFile).toHaveBeenCalledWith(filePath);
            expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
        });

        it('should create a file without a template when the template file is null', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            // Act
            await repository.create(filePath, null);

            // Assert
            expect(fileAdapter.createFile).toHaveBeenCalledWith(filePath);
            expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
        });

        it('should create a file without a template when the template file is not specified', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            // Act
            await repository.create(filePath);

            // Assert
            expect(fileAdapter.createFile).toHaveBeenCalledWith(filePath);
            expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
        });
    });

    describe('readContents', () => {
        it('should call the read contents method on the adapter if the file exists', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(true);

            // Act
            await repository.readContents(filePath);

            // Assert
            expect(fileAdapter.readContents).toHaveBeenCalledWith(filePath);
        });

        it('should not call the read contents method on the adapter if the file does not exist and return an empty string', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(false);

            // Act
            const result = await repository.readContents(filePath);

            // Assert
            expect(fileAdapter.readContents).not.toHaveBeenCalled();
            expect(result).toBe('');
        });
    });

    describe('writeContents', () => {
        it('should call the write contents method on the adapter if the file exists', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            const contents = 'This is my daily note';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(true);

            // Act
            await repository.writeContents(filePath, contents);

            // Assert
            expect(fileAdapter.writeContents).toHaveBeenCalledWith(filePath, contents);
        });

        it('should not call the write contents method on the adapter if the file does not exist', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            const contents = 'This is my daily note';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(false);

            // Act
            await repository.writeContents(filePath, contents);

            // Assert
            expect(fileAdapter.writeContents).not.toHaveBeenCalled();
        });
    });

    describe('open', () => {
        it('should call the open method on the adapter if the file exists', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(true);

            // Act
            await repository.open(filePath);

            // Assert
            expect(fileAdapter.open).toHaveBeenCalledWith(filePath);
        });

        it('should not call the open method on the adapter if the file does not exist', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(false);

            // Act
            await repository.open(filePath);

            // Assert
            expect(fileAdapter.open).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should call the delete method on the adapter if the file exists', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(true);

            // Act
            await repository.delete(filePath);

            // Assert
            expect(fileAdapter.delete).toHaveBeenCalledWith(filePath);
        });

        it('should not call the delete method on the adapter if the file does not exist', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(false);

            // Act
            await repository.delete(filePath);

            // Assert
            expect(fileAdapter.delete).not.toHaveBeenCalled();
        });
    });
});