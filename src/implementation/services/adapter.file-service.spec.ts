import {AdapterFileService} from 'src/implementation/services/adapter.file-service';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import 'src/extensions/extensions';
import {Logger} from 'src/domain/loggers/logger';

describe('AdapterFileService', () => {
    let fileAdapter: jest.Mocked<FileAdapter>;
    let logger: jest.Mocked<Logger>;
    let service: AdapterFileService;

    beforeEach(() => {
        fileAdapter = {
            doesFileExist: jest.fn(),
            createFileFromTemplate: jest.fn(),
            openFile: jest.fn(),
        };
        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message);
            })
        };

        service = new AdapterFileService(fileAdapter, logger);
    });

    it('should not create a file if it already exists', async () => {
        fileAdapter.doesFileExist.mockResolvedValue(true);

        await service.tryOpenFileWithTemplate('path/to/file', 'path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
        expect(fileAdapter.openFile).toHaveBeenCalledWith('path/to/file.md');
    });

    it('should throw an error if the template does not exist', async () => {
        fileAdapter.doesFileExist.mockResolvedValueOnce(false);
        fileAdapter.doesFileExist.mockResolvedValueOnce(false);

        await expect(service.tryOpenFileWithTemplate('path/to/file', 'path/to/template')).rejects.toThrow('Template file does not exist: path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/template.md');
        expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
        expect(fileAdapter.openFile).not.toHaveBeenCalled();
    });

    it('should create a file from template and open it if it does not exist and template exists', async () => {
        fileAdapter.doesFileExist.mockResolvedValueOnce(false);
        fileAdapter.doesFileExist.mockResolvedValueOnce(true);
        fileAdapter.createFileFromTemplate.mockResolvedValue('path/to/new/file');

        await service.tryOpenFileWithTemplate('path/to/file', 'path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/template.md');
        expect(fileAdapter.createFileFromTemplate).toHaveBeenCalledWith('path/to/file.md', 'path/to/template.md');
        expect(fileAdapter.openFile).toHaveBeenCalledWith('path/to/file.md');
    });

    it('should append markdown extension to file paths if it doesnt already contain the extension', async () => {
        fileAdapter.doesFileExist.mockResolvedValue(true);

        await service.tryOpenFileWithTemplate('path/to/file', 'path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/template.md');
    });

    it('should not append markdown extension to file paths if it already contain the extension', async () => {
        fileAdapter.doesFileExist.mockResolvedValue(true);

        await service.tryOpenFileWithTemplate('path/to/file.md', 'path/to/template.md');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file.md');
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/template.md');
    });
});