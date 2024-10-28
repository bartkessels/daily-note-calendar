import { AdapterFileService } from './adapter.file.service';
import { FileAdapter } from 'src/domain/adapters/file.adapter';

describe('AdapterFileService', () => {
    let fileAdapter: jest.Mocked<FileAdapter>;
    let service: AdapterFileService;

    beforeEach(() => {
        fileAdapter = {
            doesFileExist: jest.fn(),
            createFileFromTemplate: jest.fn(),
            openFile: jest.fn(),
        };
        service = new AdapterFileService(fileAdapter);
    });

    it('should not create a file if it already exists', async () => {
        fileAdapter.doesFileExist.mockResolvedValue(true);

        await service.tryOpenFile('path/to/file', 'path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file');
        expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
        expect(fileAdapter.openFile).toHaveBeenCalledWith('path/to/file');
    });

    it('should throw an error if the template does not exist', async () => {
        fileAdapter.doesFileExist.mockResolvedValueOnce(false);
        fileAdapter.doesFileExist.mockResolvedValueOnce(false);

        await expect(service.tryOpenFile('path/to/file', 'path/to/template')).rejects.toThrow('Template file does not exist: path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file');
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/template');
        expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
        expect(fileAdapter.openFile).not.toHaveBeenCalled();
    });

    it('should create a file from template and open it if it does not exist and template exists', async () => {
        fileAdapter.doesFileExist.mockResolvedValueOnce(false);
        fileAdapter.doesFileExist.mockResolvedValueOnce(true);
        fileAdapter.createFileFromTemplate.mockResolvedValue('path/to/new/file');

        await service.tryOpenFile('path/to/file', 'path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file');
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/template');
        expect(fileAdapter.createFileFromTemplate).toHaveBeenCalledWith('path/to/file', 'path/to/template');
        expect(fileAdapter.openFile).toHaveBeenCalledWith('path/to/file');
    });
});