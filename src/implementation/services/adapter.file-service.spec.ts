import {AdapterFileService} from 'src/implementation/services/adapter.file-service';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {Logger} from 'src/domain/loggers/logger';
import 'src/extensions/extensions';

describe('AdapterFileService', () => {
    let fileAdapter: jest.Mocked<FileAdapter>;
    let logger: jest.Mocked<Logger>;
    let service: AdapterFileService;

    beforeEach(() => {
        fileAdapter = {
            doesFileExist: jest.fn(),
            createFileFromTemplate: jest.fn(),
            openFile: jest.fn(),
            readFileContents: jest.fn(),
            writeFileContents: jest.fn()
        } as jest.Mocked<FileAdapter>;
        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message);
            })
        } as jest.Mocked<Logger>;

        service = new AdapterFileService(fileAdapter, logger);
    });

    it('should check if a file exists with markdown extension', async () => {
        fileAdapter.doesFileExist.mockResolvedValue(true);

        const result = await service.doesFileExist('path/to/file');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(result).toBe(true);
    });

    it('should create a file from template if it does not exist and template exists', async () => {
        fileAdapter.doesFileExist.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

        await service.createFileWithTemplate('path/to/file', 'path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/template.md');
        expect(fileAdapter.createFileFromTemplate).toHaveBeenCalledWith('path/to/file.md', 'path/to/template.md');
    });

    it('should throw an error if the template does not exist', async () => {
        fileAdapter.doesFileExist.mockResolvedValueOnce(false).mockResolvedValueOnce(false);

        await expect(service.createFileWithTemplate('path/to/file', 'path/to/template')).rejects.toThrow('Template file does not exist: path/to/template.md');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/template.md');
        expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
    });

    it('should open a file if it exists', async () => {
        fileAdapter.doesFileExist.mockResolvedValue(true);

        await service.tryOpenFile('path/to/file');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.openFile).toHaveBeenCalledWith('path/to/file.md');
    });

    it('should throw an error if the file does not exist', async () => {
        fileAdapter.doesFileExist.mockResolvedValue(false);

        await expect(service.tryOpenFile('path/to/file')).rejects.toThrow('File does not exist: path/to/file.md');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.openFile).not.toHaveBeenCalled();
    });
});