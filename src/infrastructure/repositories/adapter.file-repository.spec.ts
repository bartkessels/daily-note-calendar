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
            const content = 'templates/daily-notes.md';

            when(fileAdapter.createFile).calledWith(filePath, content).mockResolvedValue(filePath);

            // Act
            const result = await repository.create(filePath, content);

            // Assert
            expect(result).toBe(filePath);
        });

        it('should create the folder for the file', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            const content = '## Daily note';

            // Act
            await repository.create(filePath, content);

            // Assert
            expect(fileAdapter.createFolder).toHaveBeenCalledWith('daily-notes');
        });

        it('should create a file with the specified content', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';
            const content = '## Daily note';

            // Act
            await repository.create(filePath, content);

            // Assert
            expect(fileAdapter.createFile).toHaveBeenCalledWith(filePath, content);
        });

        it('should create a file without contents when the content is null', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            // Act
            await repository.create(filePath, null);

            // Assert
            expect(fileAdapter.createFile).toHaveBeenCalledWith(filePath, null);
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

    describe('openInCurrentTab', () => {
        it('should call the method on the adapter if the file exists', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(true);

            // Act
            await repository.openInCurrentTab(filePath);

            // Assert
            expect(fileAdapter.openInCurrentTab).toHaveBeenCalledWith(filePath);
        });

        it('should not call the method on the adapter if the file does not exist', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(false);

            // Act
            await repository.openInCurrentTab(filePath);

            // Assert
            expect(fileAdapter.openInCurrentTab).not.toHaveBeenCalled();
        });
    });

    describe('openInHorizontalSplitView', () => {
        it('should call the method on the adapter if the file exists', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(true);

            // Act
            await repository.openInHorizontalSplitView(filePath);

            // Assert
            expect(fileAdapter.openInHorizontalSplitView).toHaveBeenCalledWith(filePath);
        });

        it('should not call the method on the adapter if the file does not exist', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(false);

            // Act
            await repository.openInHorizontalSplitView(filePath);

            // Assert
            expect(fileAdapter.openInHorizontalSplitView).not.toHaveBeenCalled();
        });
    });

    describe('openInVerticalSplitView', () => {
        it('should call the method on the adapter if the file exists', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(true);

            // Act
            await repository.openInVerticalSplitView(filePath);

            // Assert
            expect(fileAdapter.openInVerticalSplitView).toHaveBeenCalledWith(filePath);
        });

        it('should not call the method on the adapter if the file does not exist', async () => {
            // Arrange
            const filePath = 'daily-notes/2021-01-01.md';

            when(fileAdapter.exists).calledWith(filePath).mockResolvedValue(false);

            // Act
            await repository.openInVerticalSplitView(filePath);

            // Assert
            expect(fileAdapter.openInVerticalSplitView).not.toHaveBeenCalled();
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