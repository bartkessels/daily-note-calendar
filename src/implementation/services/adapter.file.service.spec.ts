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
        fileAdapter.doesFileExist.mockResolvedValueOnce(true);

        await service.tryOpenFile('path/to/file', 'path/to/template');

        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('path/to/file');
        expect(fileAdapter.createFileFromTemplate).not.toHaveBeenCalled();
        expect(fileAdapter.openFile).not.toHaveBeenCalled();
    });

    it('should not create a file if the template does not exist', async () => {
        fileAdapter.doesFileExist.mockResolvedValueOnce(false);
        fileAdapter.doesFileExist.mockResolvedValueOnce(false);

        await service.tryOpenFile('path/to/file', 'path/to/template');

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
        expect(fileAdapter.openFile).toHaveBeenCalledWith('path/to/new/file');
    });
});